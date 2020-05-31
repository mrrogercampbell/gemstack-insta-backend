const express = require('express')
const router = express.Router()
const AuthRoutes = require('../instaService/routes/AuthRoutes')
const HomeRoutes = require('../instaService/routes/HomeRoutes')
const UserRoutes = require('../authService/routers/user')

router.use('/', HomeRoutes)
router.use('/auth', AuthRoutes)
router.use('/users', UserRoutes)

module.exports = router