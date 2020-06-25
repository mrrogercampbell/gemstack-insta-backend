const express = require('express')
const Auth = require('../authService/middleware/Auth')
const AuthController = require('../authService/controller/authController')

const router = express.Router()

router.post('/new', AuthController.createUser)

router.post('/login', AuthController.userLogin)

router.get('/token', AuthController.createToken)

router.get('/me', Auth, AuthController.getUserProfile)

router.get("/getdata", Auth, AuthController.getData);


router.post('/me/logout', Auth, AuthController.logOutSingleUserToken)

router.post('/me/logoutall', Auth, AuthController.logOutAllUserTokens)

module.exports = router