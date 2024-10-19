const joi = require('joi');

module.exports = joi.object().keys({
    newPassword: joi.string().min(8).max(25).required(),
    confirmPassword:joi.string().min(8).max(25).required()
});