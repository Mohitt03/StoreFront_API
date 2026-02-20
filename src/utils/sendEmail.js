const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use SMTP config
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });


        await transporter.sendMail({
            from: `"StoreFront Inventory" <${process.env.EMAIL}>`,
            to,
            subject,
            html
        });

        console.log("Email sent to:", to);

    } catch (error) {
        console.error("Email sending failed:", error);
    }
};


module.exports = sendEmail