const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: {
            values: ["User", "Admin"],
            message: `{VALUE} is not supported`
        }
    },
    contact: {
        type: String,
    },
    genre: {
        type: [String],
        default: "Fiction",
    }
},
    {
        timestamps: true
    });

const User = mongoose.model("User", userSchema);

module.exports = User;