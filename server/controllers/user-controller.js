const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailService = require('../services/mail-service');
const tokenService = require('../services/token-service');

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: `User with this email already exists` });
            }

            const hashPassword = await bcrypt.hash(password, 3);
            const user = await User.create({ email, password: hashPassword, name });
            const activationLink = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });

            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
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
                return res.status(400).json({ message: 'User with this email was not found' });
            }

            if (!user.isActivated) {
                return res.status(400).json({ message: 'Account is not activated' });
            }

            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                return res.status(400).json({ message: 'Incorrect password or email' });
            }

            const tokens = tokenService.generateTokens({ userId: user._id });
            await tokenService.saveToken(user._id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
            return res.json({ ...tokens, user });
        } catch (e) {
            next(e);
        }
    }


    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
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
                return res.status(400).json({ message: 'User not found' });
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
                return res.status(401).json({ message: 'User is not authenticated' });
            }

            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);

            if (!userData || !tokenFromDb) {
                return res.status(401).json({ message: 'User is not authenticated' });
            }

            const user = await User.findById(userData.userId);
            const tokens = tokenService.generateTokens({ userId: user._id });
            await tokenService.saveToken(user._id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
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

            return res.json(user);
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
