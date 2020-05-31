const express = require('express')
const router = express.Router()
const AuthRoutes = require('./AuthRoutes')
const HomeRoutes = require('./HomeRoutes')

router.use('/', HomeRoutes)
router.use('/auth', AuthRoutes)

module.exports = router