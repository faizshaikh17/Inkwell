const { json } = require('express');
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: JSON,
        required: true
    },
    genre: {
        type: String,
    },
    description: {
        type: String,
    },
    availability: {
        type: String,
        required: true
    },
    borrowedBy: {
        type: String,
    },
    borrowDate: {
        type: String,
    },
    returnDate: {
        type: String,
    },
    renewDate: {
        type: String,
    }

},
    {
        timestamps: true
    });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;