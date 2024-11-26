const jwt = require('jsonwebtoken');
const User = require('../models/user');

const LoggedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const decodedobj = await jwt.verify(token, "InkWell");
        const { _id } = decodedobj;
        const user = await User.findById({ _id: _id });
        if (!user) {
            throw new Error("Login first");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send(err.message)
    }
};

module.exports = LoggedIn;