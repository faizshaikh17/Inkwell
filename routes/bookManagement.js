const express = require('express');
const bookRouter = express.Router();
const LoggedIn = require('../middlewares/login')
const { isAdminValidated } = require('../validation/validate');
const Book = require('../models/book')


// ------------------Feature to add books into thye collection------------------

bookRouter.post("/add", LoggedIn, async (req, res) => {
    try {
        isAdminValidated(req);
        const { title, author, genre, description, availability } = req.body;
        const book = new Book({
            title,
            author,
            genre,
            description,
            availability
        });
        await book.save();
        res.json({
            status: "201",
            message: "Book Added",
            book
        })
    } catch (error) {
        res.status(400).send("Can't add the book " + error.message)
    }
});


//------------------Feature to retrieve all books from the collection with pagination------------------

bookRouter.get("/", LoggedIn, async (req, res) => {
    try {
        const page = req.query.page;
        var size = req.query.size;
        size = size > 50 ? 50 : size;
        const books = await Book.find({}).skip(page * size).limit(size);
        res.json({ books })
    } catch (err) {
        res.json({
            status: "400",
            message: `Cant retrieve all books ${err.message}`
        })
    }
});


//------------------Feature to retrieve a book from the collection------------------

bookRouter.get("/:id", LoggedIn, async (req, res) => {
    try {
        const _id = req.params.id
        const book = await Book.findOne({ _id });
        if (!book) {
            throw new Error("Book doesn't exist")
        }
        res.json({
            status: "201",
            message: "Book retrieved sucessfully",
            book
        })
    } catch (err) {
        res.json({
            status: "400",
            message: `Cant retrieved book ${err.message}`
        })
    }
})


//------------------Feature to update a book from the collection------------------

bookRouter.put("/:id", LoggedIn, async (req, res) => {
    try {
        isAdminValidated(req);
        const _id = req.params.id
        const { title, author, genre, description, availability } = req.body;
        const book = await Book.findByIdAndUpdate({
            title,
            author,
            genre,
            description,
            availability,
        });
        if (!book) {
            throw new Error("Book does not exist");
        }
        await book.save();
        res.json({
            status: "201",
            message: "Book updated sucessfully",
            book
        });
    } catch (err) {
        res.json({
            status: "400",
            message: `Cant update book ${err.message}`
        });
    }
});


//------------------Feature to delete a book from the collection------------------

bookRouter.delete("/:id", LoggedIn, async (req, res) => {
    try {
        isAdminValidated(req);
        const _id = req.params.id
        const book = await Book.findByIdAndDelete({ _id });
        if (!book) {
            throw new Error("Book does not exist");
        }
        // await book.save();
        res.json({
            status: "201",
            message: "Book deleted sucessfully",
            book
        });
    } catch (err) {
        res.json({
            status: "400",
            message: `Cant delete book ${err.message}`
        });
    }
});

//------------------Feature to borrow a book from the collection------------------

bookRouter.post("/borrow", LoggedIn, async (req, res) => {
    try {
        const user = req.user;
        const { _id, dateBorrow } = req.body;
        var book = await Book.findOne({
            $and: [{ _id }, { availability: "yes" }]
        }).select("title author genre description");
        if (!book) {
            throw new Error("Book already borrowed")
        }
        var updateBookAvailability = await Book.findByIdAndUpdate(_id, { availability: "no" });

        console.log(book);
        await updateBookAvailability.save();

        const data = user.name;
        res.json({
            status: "201",
            message: "Book borrowed sucessfully",
            book,
            dateBorrow,
            borrowedBy: {
                data
            }
        });


    } catch (err) {
        res.json({
            status: "400",
            message: `Cant borrow book ${err.message}`
        });
    }
})
module.exports = bookRouter; 