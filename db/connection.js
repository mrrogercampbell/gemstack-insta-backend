require('dotenv').config()
const mongoose = require('mongoose')

mongoose.Promise = Promise

let mongoURI = process.env.MONGODB_URL

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(instance =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch(err => console.log('Connection Failed', err))

module.exports = mongoose