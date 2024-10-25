const joi = require('joi');

module.exports = joi.object().keys({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(15).required(),
    otp: joi.string(),
    isOtpVerified: joi.boolean().default(false),
    pets: joi.array().items(joi.string()).default([])
});