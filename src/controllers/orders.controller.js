const Order = require("../models/order.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Create Order (Customer)
 * @route   POST /api/orders
 * @access  Customer
 */
const mongoose = require("mongoose");
const ApiResponse = require("../utils/ApiResponse");

const createOrder = asyncHandler(async (req, res) => {
    const items = req.body;
    console.log(items);

    if (!items || items.length === 0) {
        throw new ApiError(400, "All fields are required");
    }



    let totalAmount = 0;
    const orderItems = [];
    let shopkeeper_id;
    for (const orderItem of items) {

        const product = await Product.findById(orderItem.product_id);
        console.log(product);
        shopkeeper_id = product.shopkeeper_id

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        if (orderItem.quantity < 1) {
            throw new ApiError(400, "Quantity must be at least 1");
        }

        if (product.stock < orderItem.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
        }





        // Deduct stock safely
        product.stock -= orderItem.quantity;
        await product.save({ validateBeforeSave: false });

        totalAmount += product.price * orderItem.quantity;

        orderItems.push({
            product_id: product._id,
            quantity: orderItem.quantity,
            priceAtPurchase: product.price,
        });
    }
    console.log(orderItems);

    const order = await Order.create([{
        customer_id: req.user._id,
        shopkeeper_id: shopkeeper_id,
        items: orderItems,
        totalAmount,
    }]);



    res.status(201).json(
        new ApiResponse(200, { order: order[0] }, "Order created successfully"));



});



/**
 * @desc    Get Orders (Role Based)
 * @route   GET /api/orders
 * @access  Customer / Shopkeeper
 */
const getOrders = asyncHandler(async (req, res) => {
    let orders;
    console.log("req.user", req.user)
    if (req.user.role === "CUSTOMER") {
        console.log("CUSTOMER");

        orders = await Order.find()
            .populate("customer_id", "name email")
            .populate("shopkeeper_id", "name email")
            .populate("items.product_id", "name");
    }
    else if (req.user.role === "SHOPKEEPER") {
        console.log("SHOPKEEPER");

        orders = await Order.find({ shopkeeper: req.user._id })
            .populate("customer_id", "name email")
            .populate("shopkeeper_id", "name email")
            .populate("items.product_id");
    }
    else {
        throw new ApiError(403, "Unauthorized access");
    }

    res.status(200).json(new ApiResponse(200, { orders }, "Fetch Succesfull"));
});


/**
 * @desc    Get Single Order
 * @route   GET /api/orders/:id 
 */
const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id)
        .populate("customer_id", "name email")
        .populate("shopkeeper_id", "name email")
        .populate("items.product_id");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }


    res.status(200).json({
        success: true,
        order,
    });
});


/**
 * @desc    Complete Order (Shopkeeper)
 * @route   PATCH /api/orders/:id/complete
 * @access  Shopkeeper
 */
const completeOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (req.user.role !== "SHOPKEEPER") {
        throw new ApiError(403, "Only shopkeeper can complete order");
    }

    if (order.shopkeeper_id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized for this order");
    }

    if (order.status === "COMPLETED") {
        throw new ApiError(400, "Order already completed");
    }

    order.status = "COMPLETED";
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order completed successfully",
        order,
    });
});


// ✅ Export All Controllers (wrapped)
module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    completeOrder,
};
