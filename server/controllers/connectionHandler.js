const Connections = require('../databases/connectionsdb')

const getConnections = async (req, res) => {
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
}

const putConnections =  async (req, res) => {
    try {
        let {
            username,
            chatroom
        } = req.body

        //We check if connection exists
        const checkConnection = await Connections.findOne(
            { username: username })

        //if first connection we create it on, if not we update connections
        if (checkConnection) {
            await Connections.updateOne({
                username: username
            }, {
                username: username,
                chatroom: chatroom
            })
            console.log('connection updated')
        } else {
            const connection = await new Connections({
                username,
                chatroom
            })

            connection.save()
            console.log('connection added')
        }

        res.status(200).json({
            success: true,
            username: username,
            chatroom: chatroom,
            msg: `${chatroom} added`
        })

    } catch (err) { console.log(err) }

}

const deleteConnections = async (req, res) => {
    try {
        let {
            username,
            chatroom
        } = req.body

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
}

module.exports = {
    getConnections, 
    putConnections,
    deleteConnections}