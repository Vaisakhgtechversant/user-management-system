const Joi = require('@hapi/joi');

module.exports = Joi.object({
  productName: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('only allow charaters and numbers')
    .min(1),
  productPrice: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers')
    .min(1),
  productDetails: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('only allow charaters and numbers')
    .min(1),
  category: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('only allow charaters and numbers')
    .min(1),
  availability: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('only allow charaters')
    .min(1),
  productCode: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('only allow charaters and letters')
    .min(1),
  quantity: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('only allow numbers')
    .min(1),
  imageURL: Joi.string(),
});
