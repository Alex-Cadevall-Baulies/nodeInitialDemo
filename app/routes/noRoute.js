const express = require('express');
const router = express.Router()

//Other routes give error
router.get('*', (req, res) =>{
    res.status(404).json({ message: 'route not found, try /players, /game or /ranking' });
});

module.exports = router