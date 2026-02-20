const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require('fs')
const app = express();
const errorHandler = require('./middlewares/errorHandler.middleware')
require("../src/cron/expiryCron")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function logger(req, res, next) {
    // Date.now
    const log = `Date:- ${new Date().toLocaleString()}, Method:- ${req.method}, URL:- ${req.url}\n`
    fs.appendFile('D:/student-crud/log/route.log.txt', log, (err) => {
        if (err) {
            console.log(err);

        }
    })
    // console.log(log);
    next();
}
app.use(logger);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message
    });
});


const AuthRoutes = require("./routes/auth.route")
const ProductRoutes = require("./routes/products.route")
const OrderRoutes = require("./routes/order.route")
const BatchRoutes = require("./routes/batch.route")

app.use('/auth', AuthRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/batch', BatchRoutes);

//Error Handler
app.use(errorHandler);

module.exports = app;