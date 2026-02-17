const express = require('express')
const router = express.Router();
const User = require('../models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { log, error } = require('console');


const Product = require("../models/product.model.js");

// ✅ POST /api/products
// Create new product
const createProduct = asyncHandler(async (req, res) => {

    const { name, description, price, stock } = req.body;

    const product = new Product({
        name,
        description,
        price,
        stock,
        shopkeeper_id: req.user._id
    });

    const savedProduct = await product.save();

    // throw new Error;

    if (error) {
        console.log(error);

    }

    res.status(201).json({
        success: true,
        data: savedProduct
    });


})

// ✅ GET /api/products
// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const id = req.user._id
        
        const products = await Product.find({ shopkeeper_id: id }).populate("shopkeeper_id", "name email")
        console.log(req.user._id);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

// ✅ GET /api/products/:id
// Get single product
const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("shopkeeper_id", "name email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
})

// ✅ PUT /api/products/:id
// Update entire product
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
})

// ✅ DELETE /api/products/:id
// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
})

// ✅ PATCH /api/products/:id/stock
// Update only stock
const updateProductStock = asyncHandler(async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.stock = stock;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
})


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductStock
};