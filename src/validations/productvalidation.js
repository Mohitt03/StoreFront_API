const Joi = require("joi");

// Create Product Validation
const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .optional(),

  price: Joi.number()
    .min(0)
    .required(),

  stock: Joi.number()
    .min(0)
    .optional() // default handled by mongoose
});


// Update Product Validation
const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  description: Joi.string()
    .trim()
    .max(500)
    .optional(),

  price: Joi.number()
    .min(0)
    .optional()
});


// Add Stock Validation
const addStockSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
});



module.exports = {
  createProductSchema,
  updateProductSchema,
  addStockSchema
};
