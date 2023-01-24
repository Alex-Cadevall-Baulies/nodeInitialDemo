const express = require('express');
const router = express.Router()
const Chat = require('../databases/chatdb')
const Connections = require('../databases/connectionsdb')

router.get('/', async (req, res) => {
    const messages = await Chat.find({})

    if (messages) {
        res.status(200).json({
            success: true,
            data: messages
        })
    } else {
        res.status(404).json('No messages yet, be the first one to post!')
    }
})

router.post('/', async (req, res) => {
    let {
        username,
        chatroom,
        message
    } = req.body
    console.log(req.body)

    const chatMessage = await new Chat({
        username,
        chatroom,
        message
    })

    chatMessage.save()

    return res.sendStatus(200)
})

router.get('/connect', async (req, res) => {
    try {
        
        const getConnections = await Connections.find({})

        if(getConnections) {
            res.status(200).json({
                success: true,
                getConnections})
        } else {
            res.status(400).json({
                success: false,
                message: 'no other connected users found'})
        }
        

    } catch (err) { console.log(err) }
})

router.put('/connect', async (req, res) => {
    try {
        let {
            username,
            chatroom
        } = req.body

        console.log('I am on /connect')
        console.log(req.body)

        //We check if connection exists
        const checkConnection = await Connections.findOne(
            { username: username })

        console.log(`connection is ${checkConnection}`)

        //if first connection we create it on, if not we update connections
        if (checkConnection) {
            const connection = await Connections.updateOne({
                username: username
            }, {
                username: username,
                chatroom: chatroom
            })

            console.log(connection)
            console.log('connection updated')
        } else {
            const connection = await new Connections({
                username,
                chatroom
            })

            connection.save()
            console.log(connection)
            console.log('connection added')
        }

        res.status(200).json({
            success: true,
            username: username,
            chatroom: chatroom,
            msg: `${chatroom} added`
        })

    } catch (err) { console.log(err) }

})

router.delete('/connect', async (req, res) => {
    try {
        let {
            username,
            chatroom
        } = req.body

        console.log('I am on /connect')
        console.log(req.body)

        //Connection should already exist so we delete it
        const checkConnection = await Connections.deleteOne(
            { username: username })

        if (checkConnection) {
            console.log(`${username} connection deleted`)
            res.status(400).json({
                success: true,
                username: username,
                chatroom: chatroom,
                msg: `${username} connection deleted`
            })
        }
    } catch (err) { console.log(err) }
})


module.exports = router