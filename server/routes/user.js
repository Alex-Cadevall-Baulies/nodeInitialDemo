const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../databases/userdb')

router.post('/', async (req, res) => {
    //we receive information from frontEnd thanks to axios
    let {
        username,
        nickname,
        password
    } = req.body
    console.log(req.body)

    //We check if username is already taken
    await User.findOne({username : username
    }).then(user => {
        if (user) {
            res.status(400).json({
                msg: "Username already registered"
            })
        }
    });

    //We check if nickname is already taken
    await User.findOne({nickname : nickname
    }).then(user => {
        if (user) {
            res.status(400).json({
                msg: "Nickname already registered"
            })
        }
    });

    let id = await User.countDocuments()
    console.log(id)

    //If all okay we create new user
    const user = new User({
        _id: id,
        username,
        nickname,
        password
    })

    user.save()
})

router.get('/login', async (req, res) => {
    let userList = await User.find({})
    res.send(userList)
    console.log(userList)
})

module.exports = router