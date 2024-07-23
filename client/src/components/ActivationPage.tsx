import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import UserService from '../services/UserService';

const ActivationPage: React.FC = () => {
    const { link } = useParams<{ link: string }>();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const activateAccount = async () => {
            if (link) {
                try {
                    await UserService.activate(link);
                    setMessage('Account activated successfully! You can now log in.');
                } catch (error) {
                    setMessage('Error activating account');
                }
            } else {
                setMessage('Activation link is missing');
            }
        };
        activateAccount();
    }, [link]);

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md="8" lg="6">
                    <Card className="p-4">
                        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                            {message}
                        </Alert>
                        <div className="text-center">
                            <Link to="/login" className="btn btn-primary mx-2">Login</Link>
                            <Link to="/register" className="btn btn-secondary mx-2">Register</Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ActivationPage;
