const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Chapter = new Schema(
    {
        name: { type: String, default: '' },
        order: { type: Number },
        semester: { type: Number },
        lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
        domain: { type: String }
    }
)

module.exports = mongoose.model('Chapter', Chapter)