import React from 'react';
import { useUser } from '../context/UserContext';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProfilePage: React.FC = () => {
    const store = useUser();

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
                            <Card.Text><strong>Registered Date:</strong> {new Date(store.user.registeredDate).toLocaleDateString()}</Card.Text>
                            <Card.Text><strong>Study Date:</strong> {new Date(store.user.studyDate).toLocaleDateString()}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
