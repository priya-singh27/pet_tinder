const joi = require('joi');

module.exports = joi.object().keys({
    petName: joi.string().min(1).required(), 
    petType: joi.string().valid('Dog', 'Cat', 'Other').required(), 
    breed: joi.string().required(), 
    age: joi.number().min(0).optional(), 
    profilePicture: joi.string().uri(),
    location: joi.object().keys({
        type: joi.string().valid('Point').required(), // Type must be "Point"
        coordinates: joi.array().items(joi.number()).length(2).required() // Array of two numbers
    }).required(),
    gender:joi.string().valid('Male','Female').required(),
});
