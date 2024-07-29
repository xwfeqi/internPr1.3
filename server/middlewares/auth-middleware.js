const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            console.log('Authorization header missing');
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            console.log('Access token missing');
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            console.log('Invalid access token');
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        console.log('Error in auth-middleware:', e);
        return next(ApiError.UnauthorizedError());
    }
};
