const joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        titile: joi.string().required(),
        descripation : joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required(),
        image: joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating: joi.number().required().min(1).max(5),
        Comment : joi.string().required(),
    }).required(),
});