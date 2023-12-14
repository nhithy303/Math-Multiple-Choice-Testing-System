const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Knowledge = new Schema(
    {
        knowledgeType: { type: Schema.Types.ObjectId, ref: 'KnowledgeType' },
        name: { type: String, default: '' },
        content: [{ type: String, default: '' }],
        lessonId: { type: Schema.Types.ObjectId }
    }
)

module.exports = mongoose.model('Knowledge', Knowledge)