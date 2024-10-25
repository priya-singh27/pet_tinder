const mongoose = require('mongoose');

module.exports = function () {
<<<<<<< Updated upstream
    mongoose.connect('mongodb://0.0.0.0:27017/new_project')
=======
    mongoose.connect('mongodb://0.0.0.0:27017/pet-tinder')
>>>>>>> Stashed changes
        .then(() => console.log('Connected...'))
        .catch(error => console.error('Could not connect to MongoDB...', error));
}