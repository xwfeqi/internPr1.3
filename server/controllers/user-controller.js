const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mail-service');
const tokenService = require('../services/token-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const { email, password, name } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return next(ApiError.BadRequest(`User with email ${email} already exists`));
            }

            const hashPassword = await bcrypt.hash(password, 3);
            const user = await User.create({ email, password: hashPassword, name });
            const activationLink = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });

            if (mailService.mg) {
                await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
            }

            return res.json({ message: 'User was created', user });
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return next(ApiError.BadRequest('User with this email was not found'));
            }

            if (!user.isActivated) {
                return next(ApiError.BadRequest('Account is not activated'));
            }

            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                return next(ApiError.BadRequest('Incorrect password'));
            }

            const tokens = tokenService.generateTokens({ userId: user._id });
            await tokenService.saveToken(user._id, tokens.refreshToken);

            return res.json({ ...tokens, user });
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await tokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({ message: 'Logout successful' });
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const { link } = req.params;
            const decoded = jwt.verify(link, process.env.JWT_ACCESS_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return next(ApiError.BadRequest('User not found'));
            }

            user.isActivated = true;
            await user.save();

            return res.json({ message: 'Account activated' });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return next(ApiError.UnauthorizedError());
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);

            if (!userData || !tokenFromDb) {
                return next(ApiError.UnauthorizedError());
            }

            const user = await User.findById(userData.userId);
            const tokens = tokenService.generateTokens({ userId: user._id });
            await tokenService.saveToken(user._id, tokens.refreshToken);

            return res.json({ ...tokens, user });
        } catch (e) {
            next(e);
        }
    }

    async getProfile(req, res, next) {
        try {
          const user = await User.findById(req.user.id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
        } catch (e) {
          next(e);
        }
      }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
