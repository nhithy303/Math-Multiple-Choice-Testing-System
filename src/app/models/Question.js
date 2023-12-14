const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Question = new Schema(
    {
        questionContent: { type: String, default: '' },
        image: { type: String, default: '' },
        choices: [
            {
                answerContent: { type: String, default: '' },
                image: { type: String, default: '' },
                isCorrect: { type: Boolean, default: false }
            }
        ],
        questionLevelId: { type: Schema.Types.ObjectId, ref: 'QuestionLevel' },
        knowledges: [{ type: Schema.Types.ObjectId, ref: 'Knowledge' }],
    }
)

module.exports = mongoose.model('Question', Question)