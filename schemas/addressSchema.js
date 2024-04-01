const Joi = require('@hapi/joi');

module.exports = Joi.object({

  fullName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('fullName must contain only alphabetic characters')
    .min(1)
    .required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(1)
    .required(),
  alternateNumber: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(1)
    .required(),
  pincode: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(6)
    .required(),
  state: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('state must contain only alphabetic characters')
    .min(1)
    .required(),
  city: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('state must contain only alphabetic characters')
    .min(1)
    .required(),
  buildingName: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('product details only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1)
    .required(),
  area: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('product details only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1)
    .required(),
  landmark: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('product details only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1)
    .required(),
});
