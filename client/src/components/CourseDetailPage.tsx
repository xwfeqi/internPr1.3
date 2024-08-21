import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { ICourse } from '../models/ICourse';

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<ICourse | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in local storage or obtained from a token

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                setCourse(response.data);

                // Find the user's study date from the studyDates array
                const userStudyDate = response.data.studyDates.find((entry: any) => entry.userId === userId)?.studyDate || '';
                setSelectedDate(userStudyDate);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setError('Failed to load course details. Please try again later.');
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
            setError('Please select a study date before saving.');
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
            alert('Study date saved successfully');

            // Update the course state with the new study date for the user
            setCourse(prevCourse => {
                if (prevCourse) {
                    const updatedStudyDates = prevCourse.studyDates.map(entry =>
                        entry.userId === userId ? { ...entry, studyDate: selectedDate } : entry
                    );

                    return { ...prevCourse, studyDates: updatedStudyDates };
                }
                return prevCourse;
            });
        } catch (error) {
            console.error('Error saving study date:', error);
            setError('Failed to save study date. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!course) {
        return <Alert variant="warning">Course not found</Alert>;
    }

    return (
        <Container>
            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>{course.name}</Card.Title>
                    <Card.Text>{course.description}</Card.Text>
                    {selectedDate && (
                        <Card.Text>Your Study Date: {new Date(selectedDate).toLocaleDateString()}</Card.Text>
                    )}
                    <Form.Group controlId="formStudyDate" className="mt-3">
                        <Form.Label>Select your start date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </Form.Group>
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    <Button variant="primary" onClick={handleSaveDate} className="mt-3">
                        Save Study Date
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/courses')} className="ml-2 mt-3">
                        Back to Courses
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourseDetailPage;
