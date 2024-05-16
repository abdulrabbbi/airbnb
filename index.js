const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utills/wrapaysnc.js");
const ExpressError = require("./utills/expresserror.js");
const {listingSchema} = require("./joi.js");
const Review = require("./models/review.js");



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

//to check the error
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }

}

// show the listing
app.get("/listing",wrapasync( async(req, res) => {
    const alllists = await listing.find();
    res.render("listing/index.ejs", {alllists});
}));
//created the new listing
app.get("/listing/new",wrapasync( async(req, res) => {
    res.render("listing/create.ejs");
}));

// show route
app.get("/listing/:id",wrapasync( async (req, res) => {
 
        let {id} = req.params;
        const list = await listing.findById(id);
        res.render("show.ejs", {list});
}));

// post the new listing
app.post("/listing/listings",validateListing, wrapasync(async(req, res, next) => {
        const newlist = new listing(req.body.listing);
        await newlist.save();
        res.redirect("/listing");
    
    
})) ;

//edit the listing
app.get("/listing/:id/edit",validateListing, wrapasync(async (req, res) => {
    let {id} = req.params;
    const list = await listing.findById(id);
    res.render("listing/edits.ejs", {list});
}));

//to update the data
app.put("/listing/:id",wrapasync( async(req, res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listing");

}));

//delete the listing
app.delete("/delete/:id",wrapasync( async(req, res) => {
    let {id} = req.params;
   const dellisting =  await listing.findByIdAndDelete(id);
   console.log(dellisting);
    res.redirect("/listing");

}));
//for all that page is not found
app.all("*", (req, res, next) => {
    next(new ExpressError(444, "page not found"));
})

//for to handle the error
app.use((err, req, res, next) => {
   let {statusCode = 444, message = "PAGE NOT FOUND"} =  err;
   res.render("error.ejs", {message});

});

//reviews 
//to post the review
app.post("/listing/:id/reviews", async()=> {
 let listing =  await listing.findById(req.params.id);
 let newreview = new Review(req.body.review);

 listing.reviews.push(newreview);
 await newreview.save();
 await listing.save();
 res.send("you review is saved");

});



app.listen(8080);