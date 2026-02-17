import Joi from "joi";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js"; // adjust path if needed

// Helper to validate MongoDB ObjectId
const objectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid MongoDB ObjectId");
    }
    return value;
};

export const validateOrder = (data) => {
    const orderValidationSchema = Joi.object({
        customer_id: Joi.string()
            .required()
            .custom(objectId)
            .messages({
                "any.required": "Customer ID is required",
                "string.empty": "Customer ID cannot be empty",
            }),

        shopkeeper_id: Joi.string()
            .required()
            .custom(objectId)
            .messages({
                "any.required": "Shopkeeper ID is required",
                "string.empty": "Shopkeeper ID cannot be empty",
            }),

        items: Joi.array()
            .items(
                Joi.object({
                    product_id: Joi.string()
                        .required()
                        .custom(objectId)
                        .messages({
                            "any.required": "Product ID is required",
                        }),

                    quantity: Joi.number()
                        .required()
                        .min(1)
                        .messages({
                            "number.base": "Quantity must be a number",
                            "number.min": "Quantity must be at least 1",
                        }),

                    priceAtPurchase: Joi.number()
                        .required()
                        .min(0)
                        .messages({
                            "number.base": "Price must be a number",
                            "number.min": "Price cannot be negative",
                        }),
                })
            )
            .min(1)
            .required()
            .messages({
                "array.base": "Items must be an array",
                "array.min": "At least one item is required",
            }),

        totalAmount: Joi.number()
            .required()
            .min(0)
            .messages({
                "number.base": "Total amount must be a number",
                "number.min": "Total amount cannot be negative",
            }),

        status: Joi.string()
            .valid("PENDING", "COMPLETED")
            .optional(),
    });

    const { error } = orderValidationSchema.validate(data, {
        abortEarly: false,
    });

    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        throw new ApiError(400, errorMessage);
    }
};
