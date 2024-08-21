import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import CourseCard from './CourseCard';
import { ICourse } from '../models/ICourse';
import { useNavigate } from 'react-router-dom';

const CourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Assume this is where you get the userId

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };

        fetchCourses();
    }, []);

    const renderCourses = (courseType: 'active', name: string) => {
        const filteredCourses = courses.filter(course => course.type === courseType);

        return (
            <div className="mb-5">
                <h4 className="d-flex align-items-center mb-4">
                    {name} <Badge pill bg="success" className="ml-2">{filteredCourses.length}</Badge>
                </h4>
                <Row>
                    {filteredCourses.map(course => (
                        <Col key={course._id} xs={12} md={6} lg={4} className="mb-4">
                            <CourseCard
                                course={course}
                                userId={userId!} 
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    return (
        <Container className="mt-5">
            <Button variant="primary" className="mb-4" href="/profile">Go to Profile</Button>
            {renderCourses('active', 'Active Courses')}
        </Container>
    );
};

export default CourseListPage;
