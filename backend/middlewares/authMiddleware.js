const jet = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const tokenHeader = req.header['authorization'];

    if (!tokenHeader) {
        return res.status(403).json({ status: 'error', message: 'No token provided'});
    }

    try {
        const token = tokenHeader.split(' ')[1];
        const decoded = JsonWebTokenError.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized (Invalid Token)' });
    }
}