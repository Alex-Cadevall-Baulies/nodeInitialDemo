const express = require('express');
const router = express.Router()
const {registerUser, loginUser} = require('../controllers/userRegistration')
const {postRooms, putRooms, deleteRooms} = require('../controllers/roomHandler')

router.post('/register', registerUser)
router.post('/login', loginUser),

router.post('/rooms', postRooms),
router.put('/rooms', putRooms)
router.delete('/rooms', deleteRooms)

module.exports = router