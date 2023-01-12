const express = require('express');
const router = express.Router()
const Chat = require('../databases/chatdb')

router.get('/', async (req, res) => {
    const messages = await Chat.find({})

    if(messages) {
        res.status(200).json(messages)
    } else{
        res.status(404).json('No messages yet, be the first one to post!')
    }
})

module.exports = router