const {Schema, model, default: mongoose} = require('mongoose');

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: String

},
{
    timestamps: true
})

module.exports = model('Post', PostSchema)