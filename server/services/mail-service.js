const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

class MailService {
    constructor() {
        if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
            throw new Error('Mailgun API key or domain not set');
        }

        const mailgun = new Mailgun(formData);
        this.mg = mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY
        });
    }

    async sendActivationMail(email, link) {
        const messageData = {
            from: 'smtptest123qwe@gmail.com',
            to: email,
            subject: 'Account Activation',
            html: `
                <h2>Welcome to Our App!</h2>
                <p>To activate your account, please click on the link below:</p>
                <a href="${link}">Activate Account</a>
            `
        };
        await this.mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    }
}

module.exports = new MailService();
