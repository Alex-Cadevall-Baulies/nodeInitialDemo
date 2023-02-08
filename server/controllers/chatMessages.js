const Chat = require('../databases/chatdb')

const getMessages = async (req, res) => {
    const messages = await Chat.find({})

    if (messages) {
        res.status(200).json({
            success: true,
            data: messages
        })
    } else {
        res.status(404).json('No messages yet, be the first one to post!')
    }
}

const postMessages = async (req, res) => {
    let {
        username,
        chatroom,
        message
    } = req.body

    const chatMessage = await new Chat({
        username,
        chatroom,
        message
    })

    chatMessage.save()

    return res.sendStatus(200)
}

module.exports = {
    getMessages, 
    postMessages}