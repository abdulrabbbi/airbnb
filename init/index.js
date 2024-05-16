const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../models/listing");

mongoUrl = "mongodb://127.0.0.1:27017/superlust";
async function main(){
    await mongoose.connect(mongoUrl);
}

main()
.then(res => {console.log("connection is working")})
.catch(err => {console.log(err)});

const initDb = async(req, res) => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("you are fuck by many things");
}
initDb();