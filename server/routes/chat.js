const express = require('express');
const router = express.Router()
const {getMessages, postMessages} = require('../controllers/chatMessages')
const {getConnections, putConnections, deleteConnections} = require('../controllers/connectionHandler')

router.get('/', getMessages)
router.post('/', postMessages)

router.get('/connect', getConnections)
router.put('/connect', putConnections)
router.delete('/connect', deleteConnections)


module.exports = router