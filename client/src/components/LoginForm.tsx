import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../services/AuthService';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await AuthService.login(email, password);
            navigate('/profile');
        } catch (error: any) {
            console.error('Error during login:', error);

            if (error.response) {
                const { status, data } = error.response;

                if (status === 401) {
                    setError('Invalid email or password.');
                } else if (status === 400 && data.message.includes('User with email')) {
                    setError('User already exists.');
                } else if (status === 400) {
                    setError(data.message || 'Login failed. Please check your credentials.');
                } else {
                    setError('An unexpected server error occurred. Please try again later.');
                }
            } else if (error.request) {
                setError('Login failed. Please check your internet connection.');
            } else {
                setError(`${error.message || 'Please try again.'}`);
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
                    <Card className="p-4 shadow-lg" style={{ borderRadius: '20px' }}>
                        <h2 className="text-center mb-4">Login</h2>
                        {error && (
                            <Alert variant="danger" className="text-center">
                                {error}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail" className="mt-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-4">
                                Login
                            </Button>
                            <Button
                                variant="outline-primary"
                                type="button"
                                className="w-100 mt-3"
                                onClick={handleFacebookLogin}
                            >
                                Login with Facebook
                            </Button>
                        </Form>
                        <div className="text-center mt-3">
                            Don't have an account? <a href="/register">Register</a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
