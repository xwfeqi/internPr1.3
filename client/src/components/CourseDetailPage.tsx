import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { ICourse } from '../models/ICourse';

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<ICourse | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                setCourse(response.data);

                const userStudyDate = response.data.studyDates.find((entry: any) => entry.userId === userId)?.studyDate || '';
                setSelectedDate(userStudyDate);

            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id, userId]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const handleSaveDate = async () => {
        if (!selectedDate) {
            console.error('Please select a study date before saving.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/courses/${id}/set-study-date`, 
                { studyDate: selectedDate }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );

            setCourse(prevCourse => {
                if (prevCourse) {
                    const updatedStudyDates = prevCourse.studyDates.map(entry =>
                        entry.userId === userId ? { ...entry, studyDate: selectedDate } : entry
                    );

                    return { ...prevCourse, studyDates: updatedStudyDates };
                }
                return prevCourse;
            });

            // Show success message
            setSuccessMessage('Study date saved successfully');
            setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
        } catch (error) {
            console.error('Error saving study date:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <Container>
            <Card className="mt-4 shadow-lg" style={{ borderRadius: '20px', border: 'none' }}>
                <Card.Body>
                    <div className="text-center">
                        <Card.Title className="display-5 mb-4" style={{ fontWeight: 'bold' }}>{course.name}</Card.Title>
                        <Card.Text className="text-muted mb-4">{course.description}</Card.Text>
                    </div>
                    <hr className="my-4" />
                    <div className="text-center mb-4">
                        {selectedDate ? (
                            <h5>Your Study Date: <strong>{new Date(selectedDate).toLocaleDateString()}</strong></h5>
                        ) : (
                            <h5 className="text-muted">No Study Date Set</h5>
                        )}
                    </div>
                    <Form.Group controlId="formStudyDate" className="text-center">
                        <Form.Label>Select your start date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="mx-auto"
                            style={{ maxWidth: '300px' }}
                        />
                    </Form.Group>
                    {successMessage && (
                        <div className="text-center mt-3">
                            <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px' }}>
                                {successMessage}
                            </div>
                        </div>
                    )}
                    <div className="text-center mt-4">
                        <Button variant="primary" onClick={handleSaveDate} className="px-4">
                            Save Study Date
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/courses')} className="ml-3 px-4">
                            Back to Courses
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourseDetailPage;
