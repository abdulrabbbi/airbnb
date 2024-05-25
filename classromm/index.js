const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(cookieParser());

const sessionOption = {
 secret: "komalthefuckingShit",
 resave: false, 
 saveUninitialized: true
};
app.use(session(sessionOption));
app.use(flash());
app.use((req, res, next) => {
    res.locals.errmsg = req.flash("eror");
    res.locals.msg = req.flash("success");
    next();
});



app.get("/register", (req, res) => {
    const {name = "komal"}  = req.query;
    req.session.name = name;
    if(name == "komal"){
        req.flash("eror", "user not register sucessfully");
    }else{
        req.flash("success", "user register sucessfully!");
    }
    
   
    res.redirect("/hello");

});

app.get("/hello", (req, res) => {
   
    res.render("index.ejs", {name: req.session.name});
});
    

app.get("/khan", (req, res) => {
    res.send(`thanks to mamo${req.session.name}`);
})

app.get("/seethe", (req, res) => {
   if(req.session.count){
    req.session.count++;
   }else{
    req.session.count = 1;
   }

   res.send(`this is the timie that user enter the page ${req.session.count}`);
})

app.get("/test", (req, res) => {
    res.send("see your fucking cokkiee at console section");
})


app.listen(3000);