const Token = require('../models/token-model');
const jwt = require('jsonwebtoken');

class TokenService {
    generateTokens(payload) {
        try {
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
            return {
                accessToken,
                refreshToken
            };
        } catch (err) {
            console.error('Error generating tokens:', err);
            throw err;
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await Token.findOne({ user: userId });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            const token = await Token.create({ user: userId, refreshToken });
            return token;
        } catch (err) {
            console.error('Error saving token:', err);
            throw err;
        }
    }

    async removeToken(refreshToken) {
        try {
            const tokenData = await Token.deleteOne({ refreshToken });
            return tokenData;
        } catch (err) {
            console.error('Error removing token:', err);
            throw err;
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        try {
            const tokenData = await Token.findOne({ refreshToken });
            return tokenData;
        } catch (err) {
            console.error('Error finding token:', err);
            throw err;
        }
    }
}

module.exports = new TokenService();