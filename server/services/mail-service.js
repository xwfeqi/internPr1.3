const mailgun = require('mailgun.js');
const formData = require('form-data');

class MailService {
    constructor() {
        if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
            const mg = mailgun.client({
                key: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN,
                formData: formData
            });
            this.mg = mg;
        } else {
            console.warn('Mailgun API key or domain not set');
            this.mg = null;
        }
    }

    async sendActivationMail(to, link) {
        if (!this.mg) {
            console.warn('Mailgun client not initialized');
            return;
        }
        const data = {
            from: 'smtptest123qwe@gmail.com',
            to,
            subject: 'Account Activation',
            html: `<h1>Click the link to activate</h1><p><a href="${link}">${link}</a></p>`
        };
        await this.mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    }
}

module.exports = new MailService();
