const Joi = require('@hapi/joi');

module.exports = Joi.object({
  firstname: Joi.string().min(2).pattern(/^[a-zA-Z]+$/).message('First name must contain only alphabetic characters')
    .required(),
  lastname: Joi.string().min(2).pattern(/^[a-zA-Z]+$/).message('Last name must contain only alphabetic characters')
    .required(),
});
