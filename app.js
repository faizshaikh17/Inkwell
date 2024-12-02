const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser')

const authRouter = require('./routes/auth')
const bookRouter = require('./routes/bookManagement')

const dbConnect = require('./config/database')
dbConnect()
    .then((res) => console.log("db running"))
    .catch((err) => console.log(err.message));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.listen(port);