const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../databases/userdb')

//hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', async (req, res) => {
    //we receive information from frontEnd thanks to axios
    let {
        username,
        nickname,
        password
    } = req.body
    console.log(req.body)

    //We check if username is already taken
    const usernameCheck = await User.findOne({username : username
    })
    
    if (usernameCheck) {
        return res.status(400).json({
            msg: "Username already registered"
            }) 
    }

    //We check if nickname is already taken
    const nicknameCheck = await User.findOne({nickname : nickname
    })

    if (nicknameCheck) {
            return res.status(400).json({
                msg: "Nickname already registered"
            })
    }

    //If checks work we hash the password and send it to create user
    const hash = await bcrypt.hashSync(password, saltRounds);
    console.log(`this is the ${hash}`)
    
    let id = await User.countDocuments()
    console.log(id)

    //If all okay we create new user
    const user = await new User({
        _id: id,
        username,
        nickname,
        password: hash
    })

    user.save()
})

router.post('/login' , async (req, res) => {
    let {
        username,
        password
    } = req.body

    console.log(username)
    const usernameCheck = await User.findOne({username : username
    })
    console.log(usernameCheck)

    if(!usernameCheck) res.status(400).json({msg: 'User not registered'})
    
    if(usernameCheck) {
        const validatePassword = await bcrypt.compare(password, usernameCheck.password)
        if(validatePassword){
            res.status(200).json({msg: `Valid password, welcome ${usernameCheck.username}`})
        }
        else res.status(400).json({msg: 'Wrong password'})
    }
})

router.get('/', async (req, res) => {
    let userList = await User.find({})
    if (userList.length == 0) return res.send(`0 usuaris registrats`)
    res.send(userList)
    console.log(userList)
})

module.exports = router