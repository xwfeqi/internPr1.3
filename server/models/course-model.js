const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['active', 'upcoming', 'finished'], required: true },
    studyDates: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studyDate: { type: String }
    }]
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

