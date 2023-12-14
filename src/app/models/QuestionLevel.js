const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuestionLevel = new Schema(
    {
        level: { type: String, default: '' }
    }
)

module.exports = mongoose.model('QuestionLevel', QuestionLevel)