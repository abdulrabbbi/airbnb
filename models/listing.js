const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: 
    {
        type: String,
        required: true
    },
    description: {
        type: String,
         
    },
    image:{
        type: Object,
        default:
            "https://unsplash.com/photos/silver-sports-coupe-on-asphalt-road-ZRns2R5azu0",
        set : (v) => 
        v === "" ? "https://unsplash.com/photos/silver-sports-coupe-on-asphalt-road-ZRns2R5azu0" : v, 

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ]
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;