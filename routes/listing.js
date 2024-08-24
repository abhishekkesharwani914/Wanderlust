const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isloggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Index and Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedIn,validateListing,upload.single("listing[image]"), wrapAsync( listingController.createListing));

//New Route
router.get("/new",isloggedIn, listingController.renderNewForm);

// Show, Update and Delete Route
router.route("/:id")
.get(wrapAsync( listingController.showListings))
.put(isloggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync( listingController.updateListing))
.delete(isloggedIn,wrapAsync( listingController.deleteListing));

// Edit Route
router.get("/:id/edit",isloggedIn,isOwner, wrapAsync( listingController.editListing));

module.exports = router;