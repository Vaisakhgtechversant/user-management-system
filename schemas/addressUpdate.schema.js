const Joi = require('@hapi/joi');

module.exports = Joi.object({

  fullName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('fullName must contain only alphabetic characters')
    .min(1),
  phoneNumber: Joi.string()
    .pattern(/^[0-9 ]+$/).message('phone Number only allow numbers').min(1),
  alternateNumber: Joi.string()
    .pattern(/^[0-9 ]+$/).message('alternate Number only allow numbers').min(1),
  pincode: Joi.string()
    .pattern(/^[0-9 ]+$/).message('pincode only allow numbers').min(6),
  state: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('state must contain only alphabetic characters')
    .min(1),
  city: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('city must contain only alphabetic characters')
    .min(1),
  buildingName: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('buildingName  only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
  area: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('area only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
  landmark: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('landmark  only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
});
