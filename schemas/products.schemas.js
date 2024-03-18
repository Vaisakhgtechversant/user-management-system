const Joi = require('@hapi/joi');

module.exports = Joi.object({
  productName: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('First name must contain only alphabetic characters')
    .min(1)
    .required(),
  productPrice: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  productDetails: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  category: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  availability: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  productCode: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  quantity: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  imageURL: Joi.string(),
  role: Joi.string()
    .valid('admin')
    .required(),
});
