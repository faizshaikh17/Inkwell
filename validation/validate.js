const validator = require('validator');
const User = require('../models/user')

// ---------------------Signup User validation------------------------

const isSignupUserValidated = (req) => {
    const { name, emailId, password, accountType } = req.body;
    if (!name || !emailId || !password || !accountType) {
        throw new Error("Enter user details correctly")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Enter correct Email");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password");
    }
}


// ---------------------Login User validation------------------------


const isLoginUserValidated = (req) => {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
        throw new Error("Enter login details correctly")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Enter correct MailId");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password");
    }
}


// ---------------------Admin for adding book validation------------------------

const isAdminValidated = (req) => {
    const user = req.user;
    if (user.accountType !== "Admin") {
        throw new Error("Only Admin allowed")
    }
}

module.exports = { isSignupUserValidated, isLoginUserValidated, isAdminValidated };