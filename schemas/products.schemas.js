const Joi = require('@hapi/joi');

module.exports = Joi.object({
  title: Joi.string()
    .pattern(/^(?=(?:[^ ]* ){0,2}[^ ]*$)[a-zA-Z0-9 -]+$/).message('only allow charaters, numbers, hyphens and allow 2 spaces')
    .min(1),
  price: Joi.string()
    .pattern(/^[0-9 .]+$/).message('productPrice only allow numbers and dots')
    .min(1),
  description: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('product details only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
  category: Joi.string()
    .pattern(/^[a-zA-Z0-9, -]+$/).message('category only allow charaters numbers and hyphens')
    .min(1),
  availability: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('only allow charaters')
    .min(1),
  // productCode: Joi.string()
  //   .pattern(/^[a-zA-Z0-9 -]+$/).message('only allow charaters, hyphens and letters')
  //   .min(1),
  stock: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers')
    .min(1),
  imageURL: Joi.string(),
  color: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('only allow letter').min(3),
  offer: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(1),
  size: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(1),
  discountedPrice: Joi.string(),

});
