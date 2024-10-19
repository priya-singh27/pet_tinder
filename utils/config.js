require('dotenv').config();
const secretKey = process.env.Secret_Key;

module.exports = function () {
    if (!secretKey) {
        console.log('FATAL ERROR:jwtPrivateKey is not defined.');
        process.exit(1);
    }
}