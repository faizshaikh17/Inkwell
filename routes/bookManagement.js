const express = require('express');
const bookRouter = express.Router();
const LoggedIn = require('../middlewares/login')
const { isAdminValidated } = require('../validation/validate');
const Book = require('../models/book')

bookRouter.post("/addbook", LoggedIn, async (req, res) => {
    try {
        isAdminValidated(req);
        const { title, author } = req.body;
        const book = new Book({
            title,
            author
        });
        await book.save();
        res.json({
            message: "Book Added",
            book
        })
    } catch (error) {
        res.status(400).send("Can't add the book " + error.message)
    }
});

module.exports = bookRouter; 