const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.provider; } },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    accountId: { type: String, unique: true, sparse: true },
    provider: { type: String, default: "email" },
    registeredDate: { type: Date, default: Date.now },
    studyDate: { type: Date }  
});

module.exports = mongoose.model('User', userSchema);
