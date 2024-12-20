import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Scorecard from './Scorecard';
import Scoreboard from './Scoreboard';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';

function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [openBoxerDialog, setOpenBoxerDialog] = useState(false);
    const [boxerA, setBoxerA] = useState('');
    const [boxerB, setBoxerB] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const isAdmin = user.firstName.toLowerCase() === 'utz';

    const handleSetBoxers = () => {
        if (!boxerA || !boxerB) {
            alert('Please enter names for both boxers.');
            return;
        }
        axios
            .post('/api/set-boxers', { boxerA, boxerB })
            .then(() => {
                alert('Boxers set successfully');
                setOpenBoxerDialog(false);
                setBoxerA('');
                setBoxerB('');
            })
            .catch((error) => {
                alert('Error setting boxers: ' + error.response.data.message);
            });
    };

    return (
        <div>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Boxing Scorecard
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        Hello, {user.firstName}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Box mt={4}>
                    <Box sx={{ mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/scorecard"
                            sx={{ mr: 2 }}
                        >
                            Submit Score
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            component={Link}
                            to="/scoreboard"
                        >
                            View Scoreboard
                        </Button>
                    </Box>
                    {isAdmin && (
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setOpenBoxerDialog(true)}
                                sx={{ mr: 2 }}
                            >
                                Set Boxers
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    axios.post('/api/start-match').then(() => {
                                        alert('Match started');
                                    });
                                }}
                                sx={{ mr: 2 }}
                            >
                                Start Match
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    axios.post('/api/next-round').then(() => {
                                        alert('Advanced to the next round');
                                    });
                                }}
                                sx={{ mr: 2 }}
                            >
                                Call Next Round
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to end the fight?')) {
                                        axios.post('/api/end-fight').then(() => {
                                            alert('Fight ended');
                                        });
                                    }
                                }}
                            >
                                End Fight
                            </Button>
                        </Box>
                    )}
                    <Routes>
                        <Route path="/scorecard" element={<Scorecard />} />
                        <Route path="/scoreboard" element={<Scoreboard />} />
                        <Route path="*" element={<Scoreboard />} />
                    </Routes>
                </Box>
            </Container>
            {/* Set Boxers Dialog */}
            <Dialog open={openBoxerDialog} onClose={() => setOpenBoxerDialog(false)}>
                <DialogTitle>Set Boxers</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Boxer A Name"
                        fullWidth
                        margin="normal"
                        value={boxerA}
                        onChange={(e) => setBoxerA(e.target.value)}
                    />
                    <TextField
                        label="Boxer B Name"
                        fullWidth
                        margin="normal"
                        value={boxerB}
                        onChange={(e) => setBoxerB(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBoxerDialog(false)}>Cancel</Button>
                    <Button onClick={handleSetBoxers} variant="contained" color="primary">
                        Set Boxers
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dashboard;
