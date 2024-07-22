import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ActivationPage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>
                    Activate your Account
                </Typography>
                <Typography variant="body1">
                    Please check your email to activate your account.
                </Typography>
            </Box>
        </Container>
    );
};

export default ActivationPage;
