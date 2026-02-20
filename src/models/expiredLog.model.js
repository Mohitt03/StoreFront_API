const mongoose = require("mongoose")

const expiredStockLogSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    },
    expiredQuantity: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    expiredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("ExpiredStockLog", expiredStockLogSchema);
