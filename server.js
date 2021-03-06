const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./server/api')
const app = express()

const cors = require('cors')
require("dotenv").config();
// DELETE AFTER DEVELOPMENT
app.use(bodyParser.json({ limit: "50mb", extended: true }))
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
}))
app.use(cors());



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

    next()
})
//  ^ DELETE AFTER DEVELOPMENT ^


app.use('/',api.plantIdentify)
app.use('/',api.gardenAreas)
app.use('/',api.botanist)
app.use('/',api.plants)
app.use('/',api.users)

const port = 3001
app.listen(port, function () {
    console.log(`up and listenes on port ${port}`)
})