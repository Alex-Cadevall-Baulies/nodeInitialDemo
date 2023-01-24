const express = require('express');
const router = express.Router()
const Chat = require('../databases/chatdb')
const Connections = require('../databases/connectionsdb')

router.get('/', async (req, res) => {
    const messages = await Chat.find({})
    //console.log(messages)

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

router.put('/connect', async (req, res) => {

    try {
        let {
            user,
            chatroom
        } = req.body

        console.log('I am on /connect')
        console.log(req.body)

    //We check if connection exists
    const checkConnection = await Connections.findOne({
            user: user
        })
    
    console.log(`connection is ${checkConnection}`)
    
    //if first connection we create it on, if not we update connections
    if(checkConnection) {
        const connection = await Connections.updateOne({
            user: user}, {
                user: user,
                chatroom: chatroom
            })
        
        console.log(connection)
        console.log('connection updated')
    } else {
        ('I AM INSIDE CHECKCONNECTION')
        const connection = await new Connections({
            _id: id,
            user,
            chatroom
        })

        connection.save()
        console.log(connection)
        console.log('connection added')
    }

    res.status(200).json({ 
                success: true,
                chatroom: chatroom,
                msg: `${chatroom} added`
            })

    } catch(err) {}
    
})


module.exports = router