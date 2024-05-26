const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utills/expresserror.js");
const wrapasync = require("../utills/wrapaysnc.js");
const { reviewSchema} = require("../joi.js");
const Review = require("../models/review.js");
const listing = require("../models/listing");

 
// to post the review 
router.post("/", wrapasync(async(req, res)=> {
    let listings =  await listing.findById(req.params.id);
    let newreview = new Review(req.body.reviews);
   
    listings.reviews.push(newreview);
   await newreview.save();
   await listings.save();
 
   req.flash("success", "your review is created succesfully!!");
   res.redirect(`/listing/${listings._id}`);
   
   }));

//to delete the review
router.delete("/:reviewId", wrapasync(async(req, res) => {
    let {id, reviewId} = req.params;
    await listing.findOneAndDelete(id, {$pull: {reviews: reviewId}});
    await Review.findOneAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
  

})); 



//to the validate the seversite review and send the feedback
const validatereview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

};


module.exports = router;