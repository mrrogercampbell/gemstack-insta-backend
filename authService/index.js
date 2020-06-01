const express = require('express')
const userRouter = require('./routes/user')
require('../db/connection')

const app = express()

app.use(express.json())
app.use(userRouter)

app.set("port", process.env.PORT || process.env.AUTHPORT);


app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get("port")}`)
})