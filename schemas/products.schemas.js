const Joi = require('@hapi/joi');

module.exports = Joi.object({
  productName: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('First name must contain only alphabetic characters')
    .min(1),
  productPrice: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  productDetails: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  category: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  availability: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  productCode: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  quantity: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  imageURL: Joi.string(),
});
