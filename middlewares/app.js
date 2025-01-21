const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'MIIEpAIBAAKCAQEAwICVGZOlCt79JZRG9d7NslU3aPVRzC2rtJJTq7G8848';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user; 
        next(); 
    });
}

module.exports = { authenticateToken };
