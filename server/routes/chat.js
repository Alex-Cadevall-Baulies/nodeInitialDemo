const express = require('express');
const router = express.Router()

//activate jsonwebtoken
const jwt = require('jsonwebtoken')
//authenticate token
const tokenAuthenticate = require('../controllers/tokenAuthenticate')

router.get('/token', tokenAuthenticate, async (req, res) => {
    res.json(chat.filter(chat => chat.username === req.usernameCheck.nickname))
})

router.delete('/logout', (req, res) => {
    // we delete the used token
    refreshToken = refreshTokens.filter(token => token !== req.body.token)
    //send delete status success
    res.sendStatus(204)
})

module.exports = router