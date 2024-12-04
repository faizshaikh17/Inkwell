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

bookBorrowPay.get("/user/fines", LoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const borrowedBy = user.name;
        var fine;
        const book = await Book.findOne({ borrowedBy });
        const day = Math.abs(Math.round((new Date(book.borrowDate).getTime() - new Date().getTime()) / (24 * 3600000)));
        console.log(day)
        if (50 >= day) {
            fine = (day - 10) * 1.25
        } else if (day > 50) {
            fine = (40 * 1.25) + (day - 50) * 2.25
        }
        res.json(`${borrowedBy} fine is ${fine}`);
    } catch (err) {
        res.status(400).json("Fine not found");
    }

});

module.exports = bookBorrowPay;