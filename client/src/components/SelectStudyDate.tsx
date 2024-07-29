import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const SelectStudyDate: React.FC = () => {
    const [studyDate, setStudyDate] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        try {
            await axios.post('http://localhost:5000/api/set-study-date', { studyDate }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error setting study date:', error);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md="6" lg="4">
                    <Card className="p-4">
                        <h2 className="text-center">Select Study Date</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formStudyDate">
                                <Form.Label>Study Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={studyDate}
                                    onChange={(e) => setStudyDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Submit
                            </Button>
                        </Form>
                        <Button variant="link" onClick={() => navigate('/profile')} className="w-100 mt-3">
                            Go to Profile
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SelectStudyDate;
