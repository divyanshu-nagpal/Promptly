const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../middleware/sendEmail');
const cloudinary = require('../config/cloudinary');


//Register user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors.array()); 
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);
        // Generate email verification token
        let imageUrl = null;
              if (req.file) {
                // If an image file is uploaded
                const result = await cloudinary.uploader.upload(req.file.path);
                // console.log(result);
                imageUrl = result.secure_url;  // Store the image URL in Cloudinary
              }

        const payload = { username, email, password: hashedPassword, profilePicture:imageUrl };
        const verificationtoken = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: '1h' });
        // console.log("CLIENT_URL: ", process.env.CLIENT_URL);
        // Send verification email
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationtoken}`;
        // console.log(verificationtoken);
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


exports.verifyEmail = async (req, res) => {
    const { verificationtoken } = req.params;

    try {
        // Decode token
        const { username, email, password, profilePicture} = jwt.verify(verificationtoken, process.env.EMAIL_SECRET);

        // Check if the email is already verified
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email is already verified or registered.' });
        }

        //save user
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

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        console.log('User found:', user);
        console.log("Comparing passwords:", password);
        console.log("Comparing passwords:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        console.log('Password match:', isMatch);

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
