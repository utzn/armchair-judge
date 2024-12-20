import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
} from '@mui/material';

function Scorecard() {
    const [score, setScore] = useState('');
    const [boxer, setBoxer] = useState('');
    const [currentRound, setCurrentRound] = useState(null);
    const [boxerOptions, setBoxerOptions] = useState([]);

    const validScores = ['10-10', '10-9', '10-8'];

    useEffect(() => {
        fetchMatchInfo();
    }, []);

    const fetchMatchInfo = () => {
        axios
            .get('/api/match')
            .then((response) => {
                const match = response.data;
                console.log('Match data:', match); // Add this line
                if (match) {
                    setBoxerOptions([
                        { value: 'A', label: match.boxerA },
                        { value: 'B', label: match.boxerB },
                    ]);
                    console.log('Boxer options:', [
                        { value: 'A', label: match.boxerA },
                        { value: 'B', label: match.boxerB },
                    ]); // Add this line
                    if (match.status === 'ongoing') {
                        setCurrentRound(match.currentRound);
                    } else if (match.status === 'ended') {
                        alert('The fight has ended. No more score submissions allowed.');
                    } else {
                        alert('No ongoing match. Please wait for the gamemaster to start the match.');
                    }
                } else {
                    alert('No match found. Please wait for the gamemaster to set up the match.');
                }
            })
            .catch((error) => {
                alert('Error fetching match info: ' + error.response.data.message);
            });
    };
    
    const submitScore = () => {
        if (!score || !boxer) {
            alert('Please select a score and a boxer.');
            return;
        }

        axios
            .post('/api/scorecard', { score, boxer })
            .then((response) => {
                alert('Score submitted successfully');
                setScore('');
                setBoxer('');
            })
            .catch((error) => {
                alert('Error submitting score: ' + error.response.data.message);
            });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Submit Score
            </Typography>
            {currentRound ? (
                <>
                    <Typography variant="subtitle1" gutterBottom>
                        Current Round: {currentRound}
                    </Typography>
                    <TextField
                        label="Score"
                        select
                        fullWidth
                        margin="normal"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                    >
                        {validScores.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Boxer"
                        select
                        fullWidth
                        margin="normal"
                        value={boxer}
                        onChange={(e) => setBoxer(e.target.value)}
                    >
                        {boxerOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submitScore}
                        fullWidth
                    >
                        Submit Score
                    </Button>
                </>
            ) : (
                <Typography variant="subtitle1">
                    Waiting for the match to start...
                </Typography>
            )}
        </Box>
    );
}

export default Scorecard;