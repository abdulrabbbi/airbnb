const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        titile: joi.string().required(),
        descripation : joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required(),
        image: joi.string().allow("", null),
    })
})