require('./utils/dbConfig')();

const express = require('express');
const app = express();

app.use(express.json());

<<<<<<< Updated upstream
=======
const user = require('./routes/user');
const pet = require('./routes/pet');

app.use('/user', user);
app.use('/pet', pet);
>>>>>>> Stashed changes

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));



