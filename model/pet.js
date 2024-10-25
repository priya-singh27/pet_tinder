const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    petName: String,
    petType: {
        type: String,
        enum:['Dog','Cat','Other']
    },
    breed: String,
    gender: {
        type: String,
        enum:['Male','Female']
    },
    age: Number,
    profilePicture: String,
    swipeCount: Number,
    location: { // Define location as a nested object
        type: {
            type: String, // This will be "Point"
            enum: ['Point'], // Restrict to "Point"
        },
        coordinates: { // Array for longitude and latitude
            type: [Number], // Array of numbers
            index: '2dsphere' // Index for geospatial queries
        }
    }

});



const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;