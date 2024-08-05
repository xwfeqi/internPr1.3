const User = require('../models/user-model');

class AdminController {
    async getStudents(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search = '' } = req.query;

            const sortOption = {};
            sortOption[sortBy] = order === 'asc' ? 1 : -1;

            const studentsQuery = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ],
                role: 'student'
            };

            const students = await User.find(studentsQuery)
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .select('name email registeredDate studyDate');

            const totalStudents = await User.countDocuments(studentsQuery);

            res.json({
                students,
                totalPages: Math.ceil(totalStudents / limit),
                currentPage: parseInt(page)
            });
        } catch (err) {
            next(err);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const student = await User.findByIdAndUpdate(id, updateData, { new: true });
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            res.json(student);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AdminController();
