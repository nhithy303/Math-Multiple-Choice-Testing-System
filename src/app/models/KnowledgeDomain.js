const mongoose = require('mongoose')

const Schema = mongoose.Schema

const KnowledgeDomain = new Schema(
    {
        name: { type: String, default: '' },
        chapters: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }]
    }
)

module.exports = mongoose.model('KnowledgeDomain', KnowledgeDomain)