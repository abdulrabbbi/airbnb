const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utills/wrapaysnc.js");
const ExpressError = require("./utills/expresserror.js");
const {listingSchema, reviewSchema} = require("./joi.js");
const Review = require("./models/review.js");
const listings = require("./route/listing.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

mongoUrl = "mongodb://127.0.0.1:27017/superlust";
async function main(){
    await mongoose.connect(mongoUrl);
}

main()
.then(res => {console.log("connection is working")})
.catch(err => {console.log(err)});

//home route
app.get("/", (req, res) => {
    res.send("hello all you fucking friends");
});


//to the validate the seversite review and send the feedback
const validatereview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}

app.use("/listing", listings);

//for to handle the error
app.use((err, req, res, next) => {
   let {statusCode = 444, message = "PAGE NOT FOUND"} =  err;
   res.render("error.ejs", {message});

});

//reviews 
// to post the review 
app.post("/listing/:id/reviews", wrapasync(async(req, res)=> {
    let listings =  await listing.findById(req.params.id);
    let newreview = new Review(req.body.reviews);
   
    listings.reviews.push(newreview);
   await newreview.save();
   await listings.save();
   // console.log(kahn);
   // console.log(result);
   res.redirect(`/listing/${listings._id}`);
   
   }));

//to delete the review
app.delete("/listing/:id/reviews/:reviewId", wrapasync(async(req, res) => {
    let {id, reviewId} = req.params;
    await listing.findOneAndDelete(id, {$pull: {reviews: reviewId}});
    await Review.findOneAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
  

})); 













//for all that page is not found
app.all("*", (req, res, next) => {
    next(new ExpressError(444, "page not found"));
})

app.listen(8080);