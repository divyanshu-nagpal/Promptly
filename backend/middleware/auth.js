const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        // console.log("hi");
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(process.env.JWT_SECRET);
        // console.log(token.split(' ')[1]);
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
        console.log("Invalid token");
    }
};

module.exports = auth;
