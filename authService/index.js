const express = require('express')
const userRouter = require('./routes/user')
const port = process.env.AUTHPORT
require('../db/connection')

const app = express()

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})