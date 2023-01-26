const express = require('express');
const router = express.Router()

const multer = require("multer");

let checkFile = function (req, file, cb) {
  if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const storage = multer.diskStorage({
  destination: './views/images',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({
  storage: storage,
  fileFilter: checkFile
})

router.get('/', function (req, res) {
  const fs = require('fs');

    const files = fs.readdirSync('./views/images');

    if (!files.length) {
      res.send('No files found')
    } else {
      res.json(files)
    }


});

router.post('/', upload.single('file-send'), (req, res) => {
  try {
    console.log(req.file)
    res.status(201).json(`Document ${req.file.originalname} guardat correctament`)
  } catch (err) {
    console.log(err)
    res.status(400).json(`Document no enviat, prova amb jpg, png o gif`)
  }
})

module.exports = router