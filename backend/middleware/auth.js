const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = async (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(process.env.JWT_SECRET);
        // console.log(token.split(' ')[1]);
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('role'); // Fetch role
        req.user = { ...decoded.user, role: user.role }; // Attach role to request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
        console.log("Invalid token");
    }
};

module.exports = auth;
