const cron = require('node-cron');
const User = require('../models/user-model');
const mailService = require('./mail-service');

class ReminderService {
    constructor() {
        this.scheduleReminders();
    }

    async sendReminderEmail(user, daysBefore) {
        console.log(`Attempting to send email to: ${user.email} - ${daysBefore} days before study date`);
        try {
            await mailService.sendReminderEmail(user.name, user.email, daysBefore);
            console.log(`Reminder email sent to ${user.email} for ${daysBefore} days before study date.`);
        } catch (err) {
            console.error('Error sending email:', err);
        }
    }

    async checkAndSendReminders() {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split('T')[0];
        
        const daysBeforeMapping = {
            30: new Date(currentDate.setDate(currentDate.getDate() + 30)).toISOString().split('T')[0],
            7: new Date(currentDate.setDate(currentDate.getDate() + 7)).toISOString().split('T')[0],
            1: new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString().split('T')[0],
        };

        for (const [daysBefore, targetDate] of Object.entries(daysBeforeMapping)) {
            const users = await User.find({ studyDate: targetDate });
            users.forEach(async (user) => {
                if (!user.remindersSent.includes(Number(daysBefore))) {
                    await this.sendReminderEmail(user, Number(daysBefore));
                    user.remindersSent.push(Number(daysBefore));
                    await user.save();
                }
            });
        }
    }

    scheduleReminders() {
        // everyday at 8 am
        cron.schedule('*/10 * * * *', async () => {
            await this.checkAndSendReminders();
        });
    }
}

module.exports = new ReminderService();
