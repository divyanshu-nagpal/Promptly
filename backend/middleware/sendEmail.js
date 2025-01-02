const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Promptly Support" <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            html: message,
        });

        // console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
