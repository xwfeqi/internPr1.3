import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Card, Button } from 'react-bootstrap';
import UserService from '../services/UserService';

const ActivationPage: React.FC = () => {
    const { link } = useParams<{ link: string }>();
    const [message, setMessage] = useState('');
    const location = useLocation();
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        if (location.state && location.state.newUser) {
            setIsNewUser(true);
            setMessage('Please activate your account using the link sent to your email.');
        } else if (link) {
            const activateAccount = async () => {
                try {
                    await UserService.activate(link);
                    setMessage('Account activated successfully! You can now log in.');
                } catch (error) {
                    setMessage('Error activating account');
                }
            };
            activateAccount();
        } else {
            setMessage('Activation link is missing');
        }
    }, [link, location.state]);


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
