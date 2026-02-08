const mongoose = require('mongoose');

let QuoteSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Inspirational', 'Life', 'Success', 'Funny', 'Wisdom', 'Other'],
        default: 'Other'
    },
    tags: [String],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

QuoteSchema.index({ text: 'text', author: 'text' });

let Quotes = mongoose.model('Quotes', QuoteSchema)

module.exports = Quotes;