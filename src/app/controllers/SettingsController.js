const Chapter = require('../models/Chapter')
const Lesson = require('../models/Lesson')
const TestLevel = require('../models/TestLevel')
const Question = require('../models/Question')
const Knowledge = require('../models/Knowledge')
const KnowledgeType = require('../models/KnowledgeType')
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
        const length = req.body["test-length"]
        const duration = req.body["test-duration"]
        Question.find({})
            .then(questions => {
                questions = multipleMongooseToObject(questions)
                const pickedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, length)
                res.render('test', {
                    cssfile: 'test.css',
                    questions: pickedQuestions,
                    answers: ['A', 'B', 'C', 'D'],
                    length: length,
                    duration: duration
                })
            })
        // let lessons = req.body["test-domains"]
        // if (Array.isArray(lessons)) {
        //     lessons = lessons.filter(ele => ele.includes('lesson'))
        // }
        // else {
        //     lessons = [lessons]
        // }
        // for (let i = 0; i < lessons.length; i++) {
        //     lessons[i] = lessons[i].split('-').pop()
        // }
        // const length = req.body["test-length"]
        // const level = req.body["test-level"]
        // const duration = req.body["test-duration"]

        // TestLevel.findById({ _id: level })
        //     .then(testLevel => {
        //         // get structure of this test level
        //         const structure = testLevel.structure
        //         // get question levels of this test
        //         let questionLevels = []
        //         structure.forEach(ele => {
        //             if (ele.percentage > 0) {
        //                 questionLevels.push(ele.questionLevelId)
        //             }
        //         })
        //         // random in range function
        //         const randomNumber = (min, max) => {
        //             return Math.random() * (max - min) + min
        //         }
        //         // calculate number of questions for each lesson
        //         let noQuestions = Array(lessons.length).fill(Math.floor(length / lessons.length))
        //         let remainder = length % lessons.length
        //         while (remainder > 0) {
        //             noQuestions[randomNumber(0, noQuestions.length)]++
        //             remainder--
        //         }
        //         // get questions of each lesson
        //         let pickedQuestions = []
        //         for (let i = 0; i < lessons.length; i++) {
        //             // Question.find({ lessonId: new mongoose.Types.ObjectId(lessons[i]), questionLevelId: { $in: questionLevels } })
        //             //     .then(questions => {
        //             //         // noQuestions[i]
        //             //         const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random())
        //             //         pickedQuestions.push(shuffledQuestions.slice(0, noQuestions[i]))
        //             //     })
        //             //     .catch(next)
        //             Knowledge.find({ lessonId: new mongoose.Types.ObjectId(lessons[i]) })
        //                 .then(knowledges => {
        //                     let knowledgeIds = []
        //                     knowledges.forEach(ele => {
        //                         knowledgeIds.push(ele._id)
        //                     })
        //                     console.log(knowledgeIds.flat())
        //                     Question.find({ knowledges: { $elemMatch: { $in: knowledgeIds } } })
        //                 })
        //                 .catch(next)
        //         }

        //         // sort questions one more time
        //         pickedQuestions.sort(() => 0.5 - Math.random())
        //         // render test
        //         req.session.questions = pickedQuestions
        //         res.render('test', {
        //             cssfile: 'test.css',
        //             questions: pickedQuestions,
        //             answers: ['A', 'B', 'C', 'D'],
        //             length: length,
        //             duration: duration
        //         })
        //     })
        //     .catch(next)
    }

    // [POST] /result
    result(req, res, next) {
        const length = parseInt(req.body.length)
        let answers = Object.values(req.body).slice(0, -1)
        let questionIds = []
        let picked = []
        answers.forEach(ele => {
            const splitted = ele.split('-')
            questionIds.push(new mongoose.Types.ObjectId(splitted[1]))
            picked.push(parseInt(splitted[2]))
        })
        Question.find({ _id: { $in: questionIds } })
            .then(questions => {
                console.log(questions)
                let knowledgeIds = []
                // questions.push(mongooseToObject(question))
                questions = multipleMongooseToObject(questions)
                let correct = new Array(questions.length)
                let correctCount = 0
                for (let i = 0; i < questions.length; i++) {
                    const splitted = answers[i].split('-')
                    for (let j = 0; j < 4; j++) {
                        if (questions[i].choices[j].isCorrect) {
                            correct[i] = j
                        }
                    }
                    if (picked[i] === correct[i]) {
                        correctCount++
                    }
                    else {
                        questions[i].knowledges.forEach(ele => {
                            knowledgeIds.push(ele)
                        })
                    }
                    // correctCount += (picked[i] === correct[i])
                    // if (question.choices[splitted[2]].isCorrect) {
                    //     correctCount++
                    // }
                }
                const grade = correctCount / length * 10
                console.log(knowledgeIds)
                Promise.all([
                    Knowledge.find({ _id: { $in: knowledgeIds } }),
                    KnowledgeType.find({})
                ])
                    .then(([knowledges, knowledgeTypes]) => {
                        console.log(knowledges)
                        res.render('result', {
                            cssfile: 'result.css',
                            length: length,
                            doneLength: questions.length,
                            questions: questions,
                            correctCount: correctCount,
                            picked: picked,
                            correct: correct,
                            grade: grade,
                            knowledges: multipleMongooseToObject(knowledges),
                            knowledgeTypes: knowledgeTypes
                        })
                    })
                    .catch(next)

                // console.log(correctCount)
                // console.log(picked)
                // console.log(correct)
                
                
            })
        // let picked = new Array(answers.length)
        // let correct = new Array(answers.length)
        // let correctCount = 0
        // let questions = []
        // for (let i = 0; i < answers.length; i++) {
        //     const splitted = answers[i].split('-')
        //     Question.findById({ _id: new mongoose.Types.ObjectId(splitted[1]) })
        //         .then(question => {
        //             question = mongooseToObject(question)
        //             console.log(`question ${question}`)
        //             questions.push(question)
        //             picked[i] = parseInt(splitted[2])
        //             for (let j = 0; j < 4; j++) {
        //                 if (question.choices[j].isCorrect) {
        //                     correct[i] = j
        //                 }
        //             }
        //             correctCount += (picked[i] === correct[i])
        //             // if (question.choices[splitted[2]].isCorrect) {
        //             //     correctCount++
        //             // }
        //         })
        //         .catch(next)
        // }
        // console.log(questions)
        // console.log(correctCount)
        // console.log(picked)
        // console.log(correct)

        
    }
}

module.exports = new SettingsController