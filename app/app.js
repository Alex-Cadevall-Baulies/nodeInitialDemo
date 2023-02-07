const express = require('express');
const app = express();
const port = 8080;
const globalRouter = require('./routes/global.js')

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(globalRouter)

const sequelize = require('./database');

const playerdb = require('./models/playerdb')
const throwdb = require('./models/throwdb')

playerdb.hasMany(throwdb)
throwdb.belongsTo(playerdb)

sequelize
    .sync({alter: true})
    .then((result) => console.log(result))
    .catch((err) => console.log(err))

app.listen(port, () => console.log(`Running on http://localhost:${port}`))
