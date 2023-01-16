const express = require('express');
const router = express.Router()
const User = require('../databases/userdb')

//hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;

//activate jsonwebtoken
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
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
    console.log(`this is the hash: ${hash}`)
    
    let id = await User.countDocuments()
    console.log(`this is the id: ${id}`)

    //If all okay we create new user
    const user = await new User({
        _id: id,
        username,
        nickname,
        password: hash
    })

    user.save()

    const accessToken = await jwt.sign({usernameCheck}, process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({
        success: true,
        msg: `Thanks for registering ${user.nickname}`,
        accessToken: accessToken
    })
})

router.post('/login' , async (req, res) => {
    let {
        username,
        password
    } = req.body
    
    console.log(req.body)

    //We check if user exist
    const usernameCheck = await User.findOne({username : username
    })

    if(!usernameCheck) res.status(401).json({
        success: false,
        msg: 'User not found, try again or register'
    })
    
    if(usernameCheck) {
        //If user exists we check crypted password
        const validatePassword = await bcrypt.compare(password, usernameCheck.password)
        
        if(validatePassword){
            //we generate token using imported function from controllers/generate token
            const accessToken = await jwt.sign({usernameCheck}, process.env.ACCESS_TOKEN_SECRET)
            const refreshToken = await jwt.sign({usernameCheck}, process.env.ACCESS_TOKEN_SECRET_REFRESH)
            
            res.status(200).json({
                success: true, 
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
})

module.exports = router