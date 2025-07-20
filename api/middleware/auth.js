const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    if (!req.headers?.authorization) {
        return res.status(401).json({ error: 'Token missing' });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET || 'RVNHSS0zQUwtTk9ERUpT');
        req.user = result; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        if (req.user.privilege_u !== role) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
