require('./utils/config')();
require('./utils/dbConfig')();

const express = require('express');
const app = express();

app.use(express.json());// It checks the Content-Type header of incoming requests and ensures that they are in JSON format.If not responds with 400

const user = require('./routes/user');

app.use('/user', user);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));



