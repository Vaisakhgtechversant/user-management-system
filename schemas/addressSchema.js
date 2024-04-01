const Joi = require('@hapi/joi');

module.exports = Joi.object({

  fullName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('fullName must contain only alphabetic characters')
    .min(1)
    .required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(1),
  alternatePhNumber: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(1),
  Pincode: Joi.string()
    .pattern(/^[0-9 ]+$/).message('only allow numbers').min(6),
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
    .min(1),
  area: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('product details only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
  landMark: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('product details only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
});
