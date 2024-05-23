const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utills/expresserror.js");
const listings = require("./route/listing.js");
const reviews = require("./route/reviews.js");

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



app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);




//for to handle the error
app.use((err, req, res, next) => {
   let {statusCode = 444, message = "PAGE NOT FOUND"} =  err;
   res.render("error.ejs", {message});

});

//for all that page is not found
app.all("*", (req, res, next) => {
    next(new ExpressError(444, "page not found"));
})

app.listen(8080);