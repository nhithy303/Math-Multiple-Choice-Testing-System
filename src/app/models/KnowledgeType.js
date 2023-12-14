const mongoose = require('mongoose')

const Schema = mongoose.Schema

const KnowledgeType = new Schema(
    {
        name: { type: String, default: '' }
    }
)

module.exports = mongoose.model('KnowledgeType', KnowledgeType)