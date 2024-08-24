const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");



const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, //Don't do `{location:{type:String}}`
            enum: ['Point'], //'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

//it is a post mongoose middleware to delete all review which is relate to that particual listing
listingSchema.post("findOneAndDelete", async(Listing) => {
    if (Listing) {
        await Review.deleteMany({_id: {$in : Listing.reviews}})
    }
})

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;