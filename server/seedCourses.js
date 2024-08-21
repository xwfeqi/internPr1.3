const mongoose = require('mongoose');
const Course = require('./models/course-model'); // Ensure this path is correct

mongoose.connect('mongodb+srv://nchiburovskiy:12345@ac-zdvpvlb.p64sz9m.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const courses = [
    {
        name: "Introduction to Programming",
        description: "A beginner course on programming fundamentals.",
        type: "active",
        studyDates: []
    },
    {   
        name: "Data Structures",
        description: "An intermediate course on data structures.",
        type: "active",
        studyDates: []
    },
];

Course.insertMany(courses)
    .then(() => {
        console.log('Courses added to the database');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error adding courses', err);
    });
