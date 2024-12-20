import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';

function Login({ setUser }) {
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios
            .post('/api/login', { firstName, password })
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
            })
            .catch((error) => {
                alert('Login failed: ' + error.response.data.message);
            });
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="First Name"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    helperText="Format: helloabcFirstName"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    fullWidth
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}

export default Login;