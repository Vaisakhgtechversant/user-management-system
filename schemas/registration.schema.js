const Joi = require('@hapi/joi');

module.exports = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('First name must contain only alphabetic characters')
    .min(1)
    .required(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z ]+$/).message('last name must contain only alphabetic characters')
    .min(1)
    .required(),
  email: Joi.string().email().lowercase().required(),
  role: Joi.string()
    .valid('agent', 'supervisor', 'qc', 'qa')
    .required(),
  password: Joi.string()
    .min(8)
    .required(),
});
