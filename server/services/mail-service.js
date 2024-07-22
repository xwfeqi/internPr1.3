const FormData = require('form-data');
const Mailgun = require('mailgun.js');

class MailService {
  constructor() {
    this.API_KEY = process.env.MAILGUN_API_KEY;
    this.DOMAIN = process.env.MAILGUN_DOMAIN;
    this.mailgun = new Mailgun(FormData);
    this.client = this.mailgun.client({ username: 'api', key: this.API_KEY });
  }

  async sendActivationMail(to, link) {
    const messageData = {
      from: 'smtptest123qwe@gmail.com',
      to,
      subject: 'Activation account on ' + process.env.API_URL,
      text: '',
      html: `
        <div>
          <h1>For activation click on the link below</h1>
          <a href="${link}">${link}</a>
        </div>
      `
    };

    try {
      const res = await this.client.messages.create(this.DOMAIN, messageData);
      console.log(`Activation email sent to ${to}`, res);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = new MailService();
