const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    console.log("=== MIDDLEWARE verifyToken ===");
    const authHeader = req.headers.token;
    console.log("Auth header:", authHeader);
    
    if (!authHeader) {
        console.log("No auth header!");
        return res.status(401).json({ err: "You are not authenticated!" });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token after split:", token ? token.substring(0, 20) + "..." : "null");

    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
            console.log("JWT verify error:", err.message);
            return res.status(403).json({ err: "Token is not valid!" });
        }
        
        console.log("User decoded:", user);
        req.user = user;
        next();
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    console.log("=== MIDDLEWARE verifyTokenAndAdmin ===");
    const authHeader = req.headers.token;
    
    if (!authHeader) {
        return res.status(401).json({ err: "You are not authenticated!" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ err: "Token is not valid!" });
        }
        
        req.user = user;
        
        if (user.role !== 'admin') {
            return res.status(403).json({ err: "You are not admin!" });
        }
        
        next();
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin
};