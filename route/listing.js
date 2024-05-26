const express = require("express");
const router = express();
const wrapasync = require("../utills/wrapaysnc.js");
const {listingSchema} = require("../joi.js");
const ExpressError = require("../utills/expresserror.js");
const listing = require("../models/listing");
const methodOverride = require("method-override");

router.use(methodOverride('_method'));

//for to flash the message
router.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//to check the error
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}



// show the listing
router.get("/",wrapasync( async(req, res) => {
    const alllists = await listing.find();
    res.render("listing/index.ejs", {alllists});
}));
//created the new listing
router.get("/new",wrapasync( async(req, res) => {
    res.render("listing/create.ejs");
}));

// show route
router.get("/:id",wrapasync( async (req, res) => {
 
        let {id} = req.params;
        const list = await listing.findById(id).populate("reviews");
        if(!list){
            req.flash("error", "the listing you are seaching is not exist");
            res.render("/listing");
        }
        res.render("show.ejs", {list});
}));

// post the new listing
router.post("/listings", wrapasync(async(req, res, next) => {
        const newlist = new listing(req.body.listing);
        await newlist.save();
        req.flash("success", "your Listing is created succesfully!!");
        res.redirect("/listing");
    
    
})) ;

//edit the listing
router.get("/:id/edit", wrapasync(async (req, res) => {
    let {id} = req.params;
    const list = await listing.findById(id);
    
    res.render("listing/edits.ejs", {list});
}));

//to update the data
router.put("/:id",wrapasync( async(req, res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "your Listing is updated succesfully!!");
    res.redirect("/listing");

}));

//delete the listing
router.delete("/delete/:id",wrapasync( async(req, res) => {
    let {id} = req.params;
   const dellisting =  await listing.findByIdAndDelete(id);
   console.log(dellisting);
   req.flash("success", "your Listing is deleted succesfully!!");
    res.redirect("/listing");

}));
module.exports = router;