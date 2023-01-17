const express = require('express');
const router = express.Router()
const Chat = require('../databases/chatdb')

router.get('/', async (req, res) => {
    const messages = await Chat.find({})
    console.log(messages)

    if (messages) {
        res.status(200).json({
            success: true,
            msg: messages})
    } else {
        res.status(404).json('No messages yet, be the first one to post!')
    }
})

router.post('/', async (req, res) => {
    let {
        user,
        chatroom,
        message
    } = req.body
    console.log(req.body)

    const chatMessage = await new Chat({
        user,
        chatroom,
        message
    })

    chatMessage.save()

    return res.sendStatus(200)
})

module.exports = router