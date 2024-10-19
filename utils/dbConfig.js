const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://0.0.0.0:27017/ticket_booking')
        .then(() => console.log('Connected...'))
        .catch(error => console.error('Could not connect to MongoDB...', error));
}