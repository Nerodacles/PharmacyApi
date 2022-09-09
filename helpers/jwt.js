const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get password vars from .env file
dotenv.config();

function authenticateToken(req, res, next) {
    const token = req.headers.authorization

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function verifyToken(token) {
    try {
        // if token is older than 1h, return false and delete token
        jwt.verify(token, process.env.TOKEN_SECRET, {maxAge: '1h'})
        return true
    } catch (err) {
        return false
    }
}

function getUserByToken(token) {
    return jwt.decode(token)
}

function generateAccessToken(username) {
    return jwt.sign({data: username}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

module.exports = {
    generateAccessToken,
    authenticateToken,
    verifyToken,
    getUserByToken
}