import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const store = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchProfile = async () => {
            if (!store.isAuth) {
                await store.setTokensFromURL();
                if (!store.isAuth) {
                    navigate('/login');
                }
            } else {
                await store.fetchUserProfile();
            }
        };
        checkAuthAndFetchProfile();
    }, [store, navigate]);

    if (!store.user) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md="8" lg="6">
                    <Card className="p-4">
                        <h2 className="text-center">Profile</h2>
                        <Card.Body>
                            <Card.Text><strong>Name:</strong> {store.user.name}</Card.Text>
                            <Card.Text><strong>Email:</strong> {store.user.email}</Card.Text>
                            {store.user.registeredDate && (
                                <Card.Text><strong>Registered Date:</strong> {new Date(store.user.registeredDate).toLocaleDateString()}</Card.Text>
                            )}
                            {store.user.studyDate && (
                                <Card.Text><strong>Study Date:</strong> {new Date(store.user.studyDate).toLocaleDateString()}</Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
