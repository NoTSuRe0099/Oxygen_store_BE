const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const req = require("express/lib/request");

const user_Schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is Required"],
        minlength: [4, "Username must be at least 4 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        validate: [isEmail, "invalid email"],
        unique: [true, "Email Already Exists"],
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    avatar: {
        type: String,
        required: [true, "image is Required"],
    },
});

user_Schema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        next(err);
    }
});

user_Schema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        console.log(err);
    }
};

user_Schema.methods.generateToken = async function () {
    const id = this._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET);
    req.user = id;
    return token;
};

module.exports = mongoose.model("User", user_Schema);
