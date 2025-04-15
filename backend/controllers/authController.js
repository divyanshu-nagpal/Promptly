const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../middleware/sendEmail');
const cloudinary = require('../config/cloudinary');
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Register User
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const payload = { username, email, password: hashedPassword, profilePicture: imageUrl };
        const verificationtoken = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: '1h' });

        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationtoken}`;
        const message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="text-align: center; color: #2563EB;">Verify Your Email Address</h1>
                <p>Dear User,</p>
                <p>Thank you for registering with us. To complete your registration and activate your account, please verify your email address by clicking the link below:</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="${verificationLink}" 
                    style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Verify My Email
                    </a>
                </p>
                <p>If you did not create an account with us, please ignore this email.</p>
                <p>Thank you,<br>The Promptly Team</p>
            </div>
        `;
        await sendEmail(email, 'Email Verification for Promptly', message);

        res.status(200).json({ msg: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const { verificationtoken } = req.params;

    try {
        const { username, email, password, profilePicture } = jwt.verify(verificationtoken, process.env.EMAIL_SECRET);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email is already verified or registered.' });
        }

        const newUser = new User({
            username,
            email,
            password,
            profilePicture,
        });

        await newUser.save();
        res.status(200).json({ msg: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ msg: 'Invalid or expired token.' });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, token } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (user.is2FAEnabled) {
            if (!token) {
                const code = speakeasy.totp({ secret: user.twoFASecret, encoding: 'base32' });
                await send2FACode(user.email, code);
                return res.status(400).json({ msg: '2FA code sent to email. Please enter it.' });
            }

            const isValid2FA = speakeasy.totp.verify({
                secret: user.twoFASecret,
                encoding: "base32",
                token,
                window: 5,
            });

            if (!isValid2FA) {
                return res.status(400).json({ msg: 'Invalid 2FA code' });
            }
        }

        const payload = { user: { id: user.id } };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

        res.json({ token: authToken, msg: 'Login successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Enable 2FA
exports.enable2FA = async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const secret = speakeasy.generateSecret({ name: `Promptly (${user.email})` });

    user.twoFASecret = secret.base32;
    user.is2FAEnabled = true;
    await user.save();

    QRCode.toDataURL(secret.otpauth_url, (err, qrCode) => {
        if (err) {
            return res.status(500).json({ message: "Error generating QR code" });
        }

        res.json({ qrCode, secret: secret.base32 });
    });
};

// Send 2FA Code
const send2FACode = async (email, code) => {
    const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="text-align: center; color: #2563EB;">Your 2FA Code</h1>
            <p>Dear User,</p>
            <p>To complete your login process, please use the following 2FA code:</p>
            <h2 style="text-align: center; color: #2563EB;">${code}</h2>
            <p>This code will expire in 10 minutes. If you did not attempt to log in, please ignore this email.</p>
            <p>Thank you,<br>The Promptly Team</p>
        </div>
    `;

    await sendEmail(email, 'Your 2FA Code for Promptly', message);
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!user.is2FAEnabled) {
        return res.status(400).json({ message: "2FA is not enabled" });
    }

    user.twoFASecret = null;
    user.is2FAEnabled = false;
    await user.save();

    res.json({ message: "2FA has been disabled successfully" });
};

// Verify 2FA Code
exports.verify2FA = async (req, res) => {
    const { userId, token } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFASecret) {
        return res.status(400).json({ message: "2FA not set up" });
    }

    const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: "base32",
        token,
        window: 1,
    });

    if (verified) {
        const payload = { user: { id: user.id } };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: authToken, msg: "2FA verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid code" });
    }
};