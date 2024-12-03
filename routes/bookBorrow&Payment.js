const express = require('express');
const bookBorrowPay = express.Router();
const LoggedIn = require('../middlewares/login')
const Book = require('../models/book');

//------------------Feature to get list of borrowed book from the collection------------------

bookBorrowPay.get("/user/history", LoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const borrowedBy = user.name;
        const page = req.query.page;
        const size = req.query.size
        const book = await Book.find({ borrowedBy }).skip(page * size).limit(size);
        if (!borrowedBy) {
            throw new Error("User has not borrowed any book")
        }
        console.log(book);
        res.json({
            status: "201",
            message: `${user.name} Borrow history`,
            book
        });
    } catch (err) {
        res.json({
            status: "400",
            message: `Can't get borrow history. ${err.message}`
        });
    }
});

module.exports = bookBorrowPay;