const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthenticatedError } = require('../errors')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthenticatedError('not found credential')
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, name: payload.name }
        next()
    }
    catch (error) {
        throw new UnauthenticatedError('not authentication')
    }
}


module.exports = auth;
