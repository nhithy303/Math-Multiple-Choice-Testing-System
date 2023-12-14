const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Lesson = new Schema(
    {
        name: { type: String, default: '' },
        order: { type: Number }
    }
)

module.exports = mongoose.model('Lesson', Lesson)