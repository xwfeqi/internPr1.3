import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ICourse } from '../models/ICourse';

const CourseCard: React.FC<ICourse> = ({ _id, name, type, userStudyDate }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/courses/${_id}`);
    };

    return (
        <Card
            onClick={handleClick}
            className={`course-card ${type}`}
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
                <Card.Title style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{name}</Card.Title>
                {userStudyDate && (
                    <Card.Text style={{ color: '#555' }}>
                        Study Date: {new Date(userStudyDate).toLocaleDateString()}
                    </Card.Text>
                )}
            </Card.Body>
        </Card>
    );
};

export default CourseCard;
