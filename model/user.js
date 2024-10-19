require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    otp: String,
    isOtpVerified:Boolean
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id}, secretKey);
    return token;
} 

const User = mongoose.model('User', userSchema);

module.exports = User;