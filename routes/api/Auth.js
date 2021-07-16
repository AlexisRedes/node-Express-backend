const express = require("express");
const router = express.Router();

const AuthController = require("../../controller/api/Auth");

router.post("/singup", AuthController.register);
router.post("/signin", AuthController.login);

module.exports = router;