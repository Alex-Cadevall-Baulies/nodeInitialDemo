const express = require('express');
const router = express.Router();

const playerRoute = require('./playerRoute');
const gameRoute = require('./gameRoute');
const rankingRouter = require('./rankingRoute');
    
router.use('/players', playerRoute)
router.use('/game', gameRoute)
router.use('/ranking', rankingRouter)

module.exports = router