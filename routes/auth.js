const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { isSignupUserValidated, isLoginUserValidated } = require('../validation/validate')


// -------------Registration of a User into Database--------------

authRouter.post('/signup', async (req, res) => {
    try {
        isSignupUserValidated(req)
        const { name, emailId, password, accountType, contact, genre } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            name,
            emailId,
            password: hashPassword,
            accountType,
            contact,
            genre
        });
        await user.save();

        res.send('User added!!')
    }
    catch (err) {
        res.status(400).send("Could not Signup" + err.message);

    }

});


// -------------Authentication of a User into Database--------------

authRouter.post("/login", async (req, res) => {
    try {
        isLoginUserValidated(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            res.status(400).send("Invalid Credentials");
        }
        const isPasswordvalid = await bcrypt.compare(password, user.password);
        if (!isPasswordvalid) {
            res.status(400).send("Invalid Credentials");
        }

        const token = await jwt.sign({ _id: user._id }, "InkWell");
        res.cookie("token", token).send("login Succesful");

    } catch (err) {
        res.status(400).send("Can't login " + err.message);
    }
})


// -------------Forgot password feature for User --------------

authRouter.patch("/password/reset", async (req, res) => {
    try {
        const { emailId, newPassword } = req.body;
        console.log(emailId, newPassword);
        const encryptedNewPassword = await bcrypt.hash(newPassword, 10)
        const user = await User.findOneAndUpdate({ emailId, password: encryptedNewPassword });
        console.log(user);
        res.send("Password updated")

    } catch (err) {
        res.status(400).send("Can't reset password " + err.message);
    }
})


// -------------Logout feature for User --------------

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) }).send("User Logged Out")
    } catch (err) {
        res.status(400).send(err.message)
    }
})


module.exports = authRouter;