const express = require('express');
const router = express.Router()
const Chat = require('../databases/chatdb')

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

        console.log(req.body)

    //We check if connection existis
        const checkConnection = await Chat.find({ 
            connections: { 
               $elemMatch: { user: user } 
            }
         }); 
    
    //if first connection we push it to db, if not we update connections array
    if(!checkConnection) {
        Chat.connections.push(req.body);
        Chat.save()
        console.log('connection added')
    } else {
         await Chat.updateOne({user: user}, {$set: {
            user: user,
            chatroom: chatroom
        }})
        console.log('connection updated')
    }
    
    res.status(200).json({ 
                success: true,

                chatroom: chatroom,
                msg: `${chatroom} added`
            })

    } catch(err) {}
    
})


module.exports = router