const Joi = require('@hapi/joi');

module.exports = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string()
    .pattern(/^[a-zA-Z0-9, -.]+$/).message('comment only allow characters, numbers, commas, hyphens, dots and spaces')
    .min(1),
});
