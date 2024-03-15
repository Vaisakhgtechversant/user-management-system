const Joi = require('@hapi/joi');

module.exports = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('First name must contain only alphabetic characters')
    .min(1),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('last name must contain only alphabetic characters')
    .min(1),
  imageURL: Joi.string(),
});
