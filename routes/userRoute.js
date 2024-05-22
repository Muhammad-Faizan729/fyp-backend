const express = require("express");
const { registerUser, LoginUser } = require("../controllers/userController");

const router = express.Router();

// use to send information from frontend to backend
router.post("/register", registerUser); // this is used to invoke function(registerUser) when ever "/register"(name of route to post data) is called.
router.post("/login", LoginUser);
module.exports = router;
