const User = require('../databases/userdb')

const postRooms = async (req, res) => {
    try{
        let user = req.body.username
        //user should always exist as we previously verified it
        const getRooms = await User.findOne({
            nickname: user
        })
        res.status(200).json({
            success: true, 
            chatroom: getRooms.chatRooms
        })

    }
    catch(err){console.log(err)}
}

const putRooms = async (req, res) => {

    try {
        let {
            username,
            chatroom
        } = req.body

        //we find user and add new chatroom into mogodb user chatroom array
        const updateRoom = await User.updateOne(
            { nickname: username },
            //we use $addToSet as, if the room was already created, it will not duplicate it
            { $addToSet: { chatRooms: chatroom } },
        );

        if (updateRoom.modifiedCount > 0) {
            res.status(200).json({ 
                success: true, 
                chatroom: chatroom,
                msg: `${chatroom} added`
            })
        } else {
            res.status(400).json({ 
                success: false, 
                msg: `room name already created` 
            })
        }
    }
    catch (err) { console.log(err) }
}

const deleteRooms = async (req, res) => {
    try{
            let {
                username,
                chatroom
            } = req.body
         
        //we find user and add new chatroom into mogodb user chatroom array
         const updateRoom = await User.updateOne(
            { nickname: username },
            //we use $addToSet as, if the room was already created, it will not duplicate it
            { $pull: { chatRooms: chatroom } },
        );

        if (updateRoom.modifiedCount > 0) {
            res.status(200).json({ 
                success: true, 
                chatroom: chatroom,
                msg: `${chatroom} deleted`
            })
        } else {
            res.status(400).json({ 
                success: false, 
                msg: `room not found` 
            })
        }
    }
    catch(err){console.log(err)}
}

module.exports = {postRooms, putRooms, deleteRooms}