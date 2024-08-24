import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Button, Spinner, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import CourseCard from './CourseCard';
import { ICourse } from '../models/ICourse';
import { useNavigate } from 'react-router-dom';

const CourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setUserId(response.data._id);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to fetch user profile.');
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to fetch courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        fetchCourses();
    }, []);

    const renderCourses = (courseType: 'active', name: string) => {
        const filteredCourses = courses.filter(course => course.type === courseType);

        return (
            <div className="mb-5">
            <h4 className="d-flex align-items-center mb-4">
                <span style={{ marginRight: '10px' }}>{name}</span>
                <Badge pill bg="success" style={{ padding: '0.5rem 0.8rem' }}>
                    {filteredCourses.length}
                </Badge>
            </h4>
            <Row>
                {filteredCourses.map(course => (
                    <Col key={course._id} xs={12} md={6} lg={4}>
                        <CourseCard
                            course={course}
                            userId={userId!}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
    }

    return (
        <Container className="mt-5">
            <Card className="mb-4 shadow-sm p-4">
                <Card.Body>
                    <Card.Title as="h2" className="text-center mb-4">My Courses</Card.Title>
                    <Card.Text className="text-center text-muted mb-4">
                        Welcome back! Here you can view all your active courses.
                    </Card.Text>
                    <Button variant="primary" className="mb-6 w-20" onClick={() => navigate('/profile')}>
                        View Profile
                    </Button>
                </Card.Body>
            </Card>

            {userId && renderCourses('active', 'Active Courses')}
        </Container>
    );
};

export default CourseListPage;
