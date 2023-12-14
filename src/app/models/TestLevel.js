const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TestLevel = new Schema(
    {
        level: { type: String, default: '' },
        structure: [{
            questionLevelId: { type: Schema.Types.ObjectId, ref: 'QuestionLevel' },
            percentage: { type: Number }
        }]
    }
)

module.exports = mongoose.model('TestLevel', TestLevel)