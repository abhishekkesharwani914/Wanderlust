const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isloggedIn,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Review Route
router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isloggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;