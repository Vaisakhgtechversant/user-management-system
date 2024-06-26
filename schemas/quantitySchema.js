const Joi = require('@hapi/joi');

module.exports = Joi.object({

  quantity: Joi.string()
    .pattern(/^[0-9 ]+$/).message('quantity only allow numbers')
    .min(1)
    .required(),
});
