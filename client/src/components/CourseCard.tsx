import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ICourse } from '../models/ICourse';

interface CourseCardProps {
    course: ICourse;
    userId: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, userId }) => {
    const navigate = useNavigate();
    const userStudyDate = course.studyDates.find(entry => entry.userId === userId)?.studyDate;

    const handleCardClick = () => {
        navigate(`/courses/${course._id}`);
    };

    return (
        <Card
            onClick={handleCardClick}
            className="course-card mb-4 shadow-sm"
            style={{
                cursor: 'pointer',
                borderRadius: '15px',
                transition: 'transform 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <Card.Body>
                <Card.Title style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {course.name}
                </Card.Title>
                <Card.Text style={{ color: '#555' }}>
                    Study Date: {userStudyDate ? new Date(userStudyDate).toLocaleDateString() : 'Not set'}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default CourseCard;
