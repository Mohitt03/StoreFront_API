const cron = require("node-cron");
const mongoose = require("mongoose");
const Batch = require("../models/batch.model.js");
const Product = require("../models/product.model.js");
const ExpiredStockLog = require("../models/expiredLog.model.js");
const sendEmail = require("../utils/sendEmail.js")
const User = require("../models/user.model.js")

cron.schedule("* * * * * ", async () => {
    // Runs every day at 12:00 AM
    // console.log(req.user.email);

    console.log("Running expiry cron job...");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const today = new Date();

        const expiredBatches = await Batch.find({
            expiryDate: { $lt: today },
            quantity: { $gt: 0 }
        }).session(session);

        for (const batch of expiredBatches) {

            const expiredQty = batch.quantity;

            // Reduce product total stock
            let data = await Product.findByIdAndUpdate(
                batch.product,
                { $inc: { stock: -expiredQty } },
                { session }
            );
            // console.log(data);

            // Log expired stock
            await ExpiredStockLog.create([{
                product: batch.product,
                batch: batch._id,
                expiredQuantity: expiredQty,
                expiryDate: batch.expiryDate
            }], { session });

            // Set batch quantity to 0
            batch.quantity = 0;
            await batch.save({ session });

            console.log("User Data");

            let user = await User.findById(data.shopkeeper_id)
            // console.log(user);


            // Sending Email 
            await sendEmail({
                to: user.email,
                subject: "Batch Expiry Notification",
                html: `
            <h3>Batch Expiry Alert</h3>
            <p><strong>Product:</strong> ${data.name}</p>
            <p><strong>Batch Quantity:</strong> ${expiredQty}</p>
            <p><strong>Expiry Date:</strong> ${batch.expiryDate.toDateString()}</p>
            <p><strong>Remaining Quantity:${data.stock}</strong> 0</p>
        `
            });


        }

        await session.commitTransaction();
        session.endSession();

        console.log(`Expired batches processed: ${expiredBatches.length}`);

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        console.error("Expiry cron failed:", error);
    }

});
