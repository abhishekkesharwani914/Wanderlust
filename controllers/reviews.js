const Review = require("../Models/review.js");
const listing = require("../Models/listing.js");

module.exports.createReview = async(req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${Listing._id}`);
};

module.exports.deleteReview = async(req, res) =>{
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});// here id is pass from which we want to delete review, pull = delete from id, reviews is review array iside that id and reviewId is Id of review which we want to delete review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);


};