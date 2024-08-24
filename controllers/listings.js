const listing = require("../Models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/tilesets');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken})

module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!Listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {Listing});
};

module.exports.createListing = async (req, res, next) => {
    geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listings);
    newListing.owner = req.user._id;
    newListing.image= { url, filename};

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    
};

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", {Listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let Listing = await listing.findByIdAndUpdate(id, {...req.body.listings});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = {url, filename};
        await Listing.save();
    };

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};