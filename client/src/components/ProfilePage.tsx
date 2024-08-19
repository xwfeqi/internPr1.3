import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ICourse } from '../models/ICourse';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [course, setCourses] = useState<ICourse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const urlAccessToken = new URLSearchParams(window.location.search).get('accessToken');
            const urlRefreshToken = new URLSearchParams(window.location.search).get('refreshToken');

            if (urlAccessToken && urlRefreshToken) {
                localStorage.setItem('accessToken', urlAccessToken);
                localStorage.setItem('refreshToken', urlRefreshToken);
            }

            if (!accessToken) {
                setLoading(false);
                setError('You are not logged in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUser(response.data);
            } catch (error: any) {
                if (error.response?.status === 401 && refreshToken) {
                    try {
                        const refreshResponse = await axios.post('http://localhost:5000/api/refresh', { refreshToken });
                        const { accessToken: newAccessToken } = refreshResponse.data;
                        localStorage.setItem('accessToken', newAccessToken);

                        const retryResponse = await axios.get('http://localhost:5000/api/profile', {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`
                            }
                        });
                        setUser(retryResponse.data);
                    } catch (refreshError) {
                        handleLogout();
                    }
                } else {
                    setError('Failed to fetch profile.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to fetch courses.');
            }
        };

        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const CourseCard = ({ course }: { course: ICourse }) => (
        <Card
            className="mb-3 shadow-sm"
            style={{
                cursor: 'pointer',
                borderRadius: '15px',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onClick={() => navigate(`/courses/${course._id}`)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
        >
            <Card.Body>
                <Card.Title style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {course.name}
                </Card.Title>
                <Card.Text style={{ color: '#555' }}>
                    Study Date: {course.userStudyDate ? new Date(course.userStudyDate).toLocaleDateString() : 'Not set'}
                </Card.Text>
            </Card.Body>
        </Card>
    );

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

    if (!user) {
        return <Alert variant="danger" className="mt-4 text-center">User not found</Alert>;
    }

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Profile</h2>
            <Row>
                <Col md={4}>
                    <Card className="p-4 shadow-sm" style={{ borderRadius: '15px' }}>
                        <h3 className="text-center mb-3">User Information</h3>
                        <Card.Body>
                            <Card.Text><strong>Name:</strong> {user.name}</Card.Text>
                            <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                            <Card.Text><strong>Registered Date:</strong> {new Date(user.registeredDate).toLocaleDateString()}</Card.Text>
                            <Button variant="danger" onClick={handleLogout} className="mt-3 w-100">
                                Logout
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <h3 className="mb-4">Active Courses <Badge pill bg="success">{course.filter(course => course.type === 'active').length}</Badge></h3>
                    <Row>
                        {course.filter(course => course.type === 'active').map(course => (
                            <Col key={course._id} md={6}>
                                <CourseCard course={course} />
                            </Col>
                        ))}
                    </Row>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/courses')} 
                        className="mt-3"
                        style={{ borderRadius: '15px' }}
                    >
                        Go to Courses
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
