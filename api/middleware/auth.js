const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid authorization header format' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        if (!process.env.JWT_KEY) {
            console.error('JWT_KEY is not defined');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        console.log('Decoded token:', decodedToken);

        req.userData = decodedToken;
        next();
    } catch (error) {
        console.error('Authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        return res.status(500).json({ error: 'Authentication failed' });
    }
};
