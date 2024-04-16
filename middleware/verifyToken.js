const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            try {
                const currentUser = await User.findById(user.id);
                req.user = currentUser;
                next();
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to authenticate user' });
            }
        });
    } else {
        return res.status(401).json({ message: 'You are not authenticated' });
    }
};

module.exports = { verifyToken };
