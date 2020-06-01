const express = require("express");
const router = express.Router();
const AuthControllers = require('../instaService/controllers/AuthControllers')

router.get("/", AuthControllers.receiveAuthCode);

router.get("/hello", AuthControllers.receiveAuthCode);

router.post("/access_token", AuthControllers.accessToken);


module.exports = router