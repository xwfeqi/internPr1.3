import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const store = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await store.login(email, password);
            if (store.user?.isActivated) {
                navigate('/profile');
            } else {
                navigate('/activation-page');
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        }
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:5000/auth/facebook';
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md="6" lg="4">
                    <Card className="p-4">
                        <h2 className="text-center">Login</h2>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Login
                            </Button>
                        </Form>
                        <Button variant="primary" className="w-100 mt-3" onClick={handleFacebookLogin}>
                            Login with Facebook
                        </Button>
                        <p className="text-center mt-3">
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>    
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
