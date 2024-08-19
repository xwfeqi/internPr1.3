const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ['active', 'upcoming', 'finished'] },
    nextLecture: { type: Date },
    studyDates: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        studyDate: { type: Date, required: true }
    }]
});

module.exports = mongoose.model('Course', courseSchema);
