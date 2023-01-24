const express = require('express');
const router = express.Router()
const User = require('../databases/userdb')

//hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;

//activate jsonwebtoken
const jwt = require('jsonwebtoken');

//used to register user
router.post('/register', async (req, res) => {
    //we receive information from frontEnd thanks to axios
    let {
        username,
        nickname,
        password
    } = req.body
    console.log(req.body)

    //We check if username is already taken
    const usernameCheck = await User.findOne({
        username: username
    })

    if (usernameCheck) {
        return res.status(400).json({
            msg: "Username already registered"
        })
    }

    //We check if nickname is already taken
    const nicknameCheck = await User.findOne({
        nickname: nickname
    })

    if (nicknameCheck) {
        return res.status(400).json({
            msg: "Nickname already registered"
        })
    }

    //If checks work we hash the password and send it to create user
    const hash = await bcrypt.hashSync(password, saltRounds);
    console.log(`this is the hash: ${hash}`)

    let id = await User.countDocuments()
    console.log(`this is the id: ${id}`)

    //If all okay we create new user
    const user = await new User({
        _id: id,
        username,
        nickname,
        chatRooms: 'main',
        password: hash
    })

    user.save()

    const accessToken = await jwt.sign({ usernameCheck }, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({
        success: true,
        msg: `Thanks for registering ${user.nickname}`,
        accessToken: accessToken
    })
})

//Used for login user
router.post('/login', async (req, res) => {
    let {
        username,
        password
    } = req.body

    console.log(req.body)

    //We check if user exist
    const usernameCheck = await User.findOne({
        username: username
    })

    if (!usernameCheck) res.status(401).json({
        success: false,
        msg: 'User not found, try again or register'
    })

    if (usernameCheck) {
        //If user exists we check crypted password
        const validatePassword = await bcrypt.compare(password, usernameCheck.password)

        if (validatePassword) {
            //we generate token using imported function from controllers/generate token
            const accessToken = await jwt.sign({ usernameCheck }, process.env.ACCESS_TOKEN_SECRET)
            const refreshToken = await jwt.sign({ usernameCheck }, process.env.ACCESS_TOKEN_SECRET_REFRESH)

            res.status(200).json({
                success: true,
                nickname: usernameCheck.nickname,
                msg: `Valid password, welcome ${usernameCheck.nickname}`,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }
        else res.status(400).json({
            success: false,
            msg: 'Wrong password, try again'
        })
    }
}),

//Used to get rooms, reason for post is we need to send user as body and get does not accept body
    router.post('/rooms', async (req, res) => {
        try{
            let user = req.body.username
            console.log(user)
            //user should always exist as we previously verified it
            const getRooms = await User.findOne({
                nickname: user
            })
            console.log('this is the get rooms')
            console.log(getRooms)
            res.status(200).json({
                success: true, 
                chatroom: getRooms.chatRooms
            })

        }
        catch(err){console.log(err)}
    }),

    //Used to add rooms
    router.put('/rooms', async (req, res) => {

        try {
            let {
                username,
                chatroom
            } = req.body
    
            console.log(req.body)
    
            //we find user and add new chatroom into mogodb user chatroom array
            const updateRoom = await User.updateOne(
                { nickname: username },
                //we use $addToSet as, if the room was already created, it will not duplicate it
                { $addToSet: { chatRooms: chatroom } },
            );
    
            console.log(updateRoom)
    
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
    })

    //Used to delete rooms
    router.delete('/rooms', async (req, res) => {
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

            console.log(updateRoom)

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
    })

module.exports = router