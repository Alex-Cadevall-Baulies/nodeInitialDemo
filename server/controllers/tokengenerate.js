//activate jsonwebtoken
const jwt = require('jsonwebtoken')

function tokenGeneration() {
    try {
        return jwt.sign(usernameCheck, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' })
    } catch (err) {
        return err
    }
    }


module.exports = tokenGeneration