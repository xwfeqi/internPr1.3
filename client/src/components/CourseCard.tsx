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

    const handleClick = () => {
        navigate(`/courses/${course._id}`);
    };

    // Find the study date for the current user
    const userStudyDate = course.studyDates.find(entry => entry.userId === userId)?.studyDate;

    return (
        <Card
            onClick={handleClick}
            className={`course-card ${course.type}`}
            style={{
                cursor: 'pointer',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <Card.Body>
                <Card.Title style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{course.name}</Card.Title>
                {userStudyDate ? (
                    <Card.Text style={{ color: '#555' }}>
                        Study Date: {new Date(userStudyDate).toLocaleDateString()}
                    </Card.Text>
                ) : (
                    <Card.Text style={{ color: '#555' }}>
                        Study Date: Not set
                    </Card.Text>
                )}
            </Card.Body>
        </Card>
    );
};

export default CourseCard;
