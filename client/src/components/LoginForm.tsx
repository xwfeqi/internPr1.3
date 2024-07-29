import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import AuthService from '../services/AuthService';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.login(email, password);
            navigate('/profile');
        } catch (error) {
            console.error('Error during login:', error);
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
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
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
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Login
                            </Button>
                            <Button
                                variant="primary"
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
    