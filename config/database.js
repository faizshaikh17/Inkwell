const mongoose = require('mongoose');

const dbConnect = async () => {
    await mongoose.connect("mongodb+srv://node:dgCxcaMQyOU5RtBA@node.tabkb.mongodb.net/InkWell")
}

module.exports = dbConnect;