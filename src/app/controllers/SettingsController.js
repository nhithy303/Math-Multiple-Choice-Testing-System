const Chapter = require('../models/Chapter')
const Lesson = require('../models/Lesson')
const TestLevel = require('../models/TestLevel')
const Question = require('../models/Question')
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');

const mongoose = require('mongoose')

class SettingsController {
    // [GET] /settings
    settings(req, res, next) {
        Promise.all([
            Chapter.find({}),
            Lesson.find({}),
            TestLevel.find({})
        ])
            .then(([chapters, lessons, testlevels]) => {
                chapters = multipleMongooseToObject(chapters)
                lessons = multipleMongooseToObject(lessons)

                let domains = [[[], []], [[], []]]
                
                chapters.forEach(chapter => {
                    let temp_lessons = []
                    chapter.lessons.forEach(lesson => {
                        let curr_lesson = lessons.find(ele => {
                            return ele._id.equals(lesson._id)
                        })
                        temp_lessons.push(curr_lesson)
                    })
                    let k = chapter.domain === 'Đại số' ? 0 : 1
                    domains[chapter.semester - 1][k].push({
                        ...chapter,
                        lessons: temp_lessons
                    })
                })
                
                req.session.destroy()
                res.render('settings', {
                    cssfile: 'settings.css',
                    domains: domains,
                    testlevels: multipleMongooseToObject(testlevels)
                })
            })
            .catch(next)
    }
    
    // [POST] /test
    test(req, res, next) {
        console.log(req.body)
        let lessons = req.body["test-domains"]
        if (Array.isArray(lessons)) {
            lessons = lessons.filter(ele => ele.includes('lesson'))
        }
        else {
            lessons = [lessons]
        }
        for (let i = 0; i < lessons.length; i++) {
            lessons[i] = lessons[i].split('-').pop()
        }
        const length = req.body["test-length"]
        const level = req.body["test-level"]
        const duration = req.body["test-duration"]

        TestLevel.findById({ _id: level })
            .then(testLevel => {
                // get structure of this test level
                const structure = testLevel.structure
                // get question levels of this test
                let questionLevels = []
                structure.forEach(ele => {
                    if (ele.percentage > 0) {
                        questionLevels.push(ele.questionLevelId)
                    }
                })
                // random in range function
                const randomNumber = (min, max) => {
                    return Math.random() * (max - min) + min
                }
                // calculate number of questions for each lesson
                let noQuestions = Array(lessons.length).fill(Math.floor(length / lessons.length))
                let remainder = length % lessons.length
                while (remainder > 0) {
                    noQuestions[randomNumber(0, noQuestions.length)]++
                    remainder--
                }
                // get questions of each lesson
                let pickedQuestions = []
                for (let i = 0; i < lessons.length; i++) {
                    Question.find({ lessonId: new mongoose.Types.ObjectId(lessons[i]), questionLevelId: { $in: questionLevels } })
                        .then(questions => {
                            // noQuestions[i]
                            const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random())
                            pickedQuestions.push(shuffledQuestions.slice(0, noQuestions[i]))
                        })
                        .catch(next)
                }
                // sort questions one more time
                pickedQuestions.sort(() => 0.5 - Math.random())
                // render test
                req.session.questions = pickedQuestions
                res.render('test', {
                    cssfile: 'test.css',
                    questions: pickedQuestions,
                    answers: ['A', 'B', 'C', 'D'],
                    length: length,
                    duration: duration
                })
            })
            .catch(next)
    }

    // [POST] /result
    result(req, res, next) {
        console.log('BODY')
        console.log(req.body)
        console.log('QUESTIONS')
        console.log(req.session.questions)
        res.render('result', {
            cssfile: 'result.css',
            questions: req.session.questions
        })
    }
}

module.exports = new SettingsController