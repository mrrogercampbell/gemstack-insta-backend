const express = require("express");
const router = express.Router();
const AuthControllers = require('../Controllers/AuthControllers')

router.get("/", AuthControllers.receiveAuthCode);

router.post("/access_token", AuthControllers.accessToken);


module.exports = router