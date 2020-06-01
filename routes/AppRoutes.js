const express = require('express')
const router = express.Router()
const AuthRoutes = require('./AuthRoutes')
const HomeRoutes = require('./HomeRoutes')
const UserRoutes = require('./User')

router.use('/', HomeRoutes)
router.use('/auth', AuthRoutes)
router.use('/user', UserRoutes)

module.exports = router