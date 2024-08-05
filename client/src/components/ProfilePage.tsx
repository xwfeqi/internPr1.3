import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            let accessToken = localStorage.getItem('accessToken');
            let refreshToken = localStorage.getItem('refreshToken');
            const urlAccessToken = new URLSearchParams(window.location.search).get('accessToken');
            const urlRefreshToken = new URLSearchParams(window.location.search).get('refreshToken');

            if (urlAccessToken && urlRefreshToken) {
                accessToken = urlAccessToken;
                refreshToken = urlRefreshToken;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            }

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {   
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (isMounted) setUser(response.data);
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                if (error.response && error.response.status === 401) {
                    try {
                        console.log('Refreshing token with refreshToken:', refreshToken);
                        const refreshResponse = await axios.post('http://localhost:5000/api/refresh', {
                            refreshToken
                        });
                        const { accessToken: newAccessToken } = refreshResponse.data;
                        localStorage.setItem('accessToken', newAccessToken);

                        const retryResponse = await axios.get('http://localhost:5000/api/profile', {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`
                            }
                        });
                        if (isMounted) setUser(retryResponse.data);
                    } catch (refreshError: any) {
                        console.error('Error refreshing token:', refreshError);
                        handleLogout();
                    }
                } else {
                    console.error('Error fetching profile:', error);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md="8" lg="6">
                    <Card className="p-4">
                        <h2 className="text-center">Profile</h2>
                        <Card.Body>
                            <Card.Text><strong>Name:</strong> {user.name}</Card.Text>
                            <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                            <Card.Text><strong>Registered Date:</strong> {new Date(user.registeredDate).toLocaleDateString()}</Card.Text>
                            <Card.Text>
                                <strong>Study Date:</strong> {user.studyDate ? new Date(user.studyDate).toLocaleDateString() : 'Not set'}
                                <Button 
                                    variant="link" 
                                    onClick={() => navigate('/select-study-date')} 
                                    className="ml-2"
                                >
                                    Select Date
                                </Button>
                            </Card.Text>
                            <Button variant="danger" onClick={handleLogout} className="mt-3">Logout</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
