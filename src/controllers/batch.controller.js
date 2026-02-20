const Batch = require("../models/batch.model");
const Product = require("../models/product.model");

const createBatch = async (req, res) => {
    try {
        const { productId, quantity, expiryDate } = req.body;

        // Create batch
        const batch = await Batch.create({
            product: productId,
            quantity,
            expiryDate
        });

        // Update product stock
        await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { new: true }
        );

        res.status(201).json({
            message: "Batch created successfully",
            batch
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // Decrease stock
        await Product.findByIdAndUpdate(
            batch.product,
            { $inc: { stock: -batch.quantity } }
        );

        await batch.deleteOne();

        res.json({ message: "Batch deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createBatch, deleteBatch }