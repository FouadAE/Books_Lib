const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");



router.post("/login", authController.login_post);
router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

module.exports = router;
