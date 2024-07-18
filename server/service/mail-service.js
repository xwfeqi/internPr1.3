const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // use TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async sendActivationMail(to, link) {
        try {
            console.log(`Attempting to send email to ${to}`);
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Activation account on ' + process.env.API_URL,
                text: '',
                html: `
                    <div>
                        <h1>For activation click on link below</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
            });
            console.log(`Activation email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

module.exports = new MailService();
