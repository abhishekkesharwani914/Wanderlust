const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/users.js")

//Signup form and after signup
router.route("/signup")
.get((req, res) => {
    res.render("users/signup.ejs");
})
.post(wrapAsync(userController.renderSignUp));

//Login from and after login
router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.login);

//l\Logout
router.get("/logout", userController.logout);

module.exports = router;