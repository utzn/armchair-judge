import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';

function Scoreboard() {
    const [scorecards, setScorecards] = useState([]);
    const [averageScores, setAverageScores] = useState([]);
    const [highestScorers, setHighestScorers] = useState({ boxerA: null, boxerB: null });
    const [matchInfo, setMatchInfo] = useState(null);

    useEffect(() => {
        fetchMatchInfo().then(() => {
            fetchScorecards();
            // Polling every 5 seconds for updates
            const interval = setInterval(() => {
                fetchScorecards();
                fetchMatchInfo();
            }, 5000);
            return () => clearInterval(interval);
        });
    }, []);

    const fetchMatchInfo = async () => {
        try {
            const response = await axios.get('/api/match');
            setMatchInfo(response.data);
        } catch (error) {
            console.error('Error fetching match info', error);
        }
    };

    const fetchScorecards = async () => {
        try {
            const response = await axios.get('/api/scorecards');
            setScorecards(response.data);
            calculateAverageScores(response.data, matchInfo);
            calculateHighestScorers(response.data, matchInfo);
        } catch (error) {
            console.error('Error fetching scorecards', error);
        }
    };

    const calculateAverageScores = (data, match) => {
        if (!match) return;
        const rounds = [...new Set(data.map((item) => item.round))].sort((a, b) => a - b);
        let totalScoreA = 0;
        let totalScoreB = 0;
        let count = 0;

        data.forEach((item) => {
            const [scoreA, scoreB] = item.score.split('-').map(Number);
            totalScoreA += scoreA;
            totalScoreB += scoreB;
            count += 1;
        });

        const averageScoreA = (totalScoreA / count).toFixed(2);
        const averageScoreB = (totalScoreB / count).toFixed(2);

        setAverageScores(`${averageScoreA}-${averageScoreB}`);
    };

    const calculateHighestScorers = (data, match) => {
        if (!match) return;
        const userScores = {};

        data.forEach((item) => {
            if (!userScores[item.userId.firstName]) {
                userScores[item.userId.firstName] = { scoreA: 0, scoreB: 0 };
            }
            const [scoreA, scoreB] = item.score.split('-').map(Number);
            userScores[item.userId.firstName].scoreA += scoreA;
            userScores[item.userId.firstName].scoreB += scoreB;
        });

        let highestScorerA = null;
        let highestScorerB = null;

        Object.keys(userScores).forEach((user) => {
            if (!highestScorerA || userScores[user].scoreA > userScores[highestScorerA].scoreA) {
                highestScorerA = user;
            }
            if (!highestScorerB || userScores[user].scoreB > userScores[highestScorerB].scoreB) {
                highestScorerB = user;
            }
        });

        setHighestScorers({
            boxerA: highestScorerA ? `${highestScorerA}: ${userScores[highestScorerA].scoreA}-${userScores[highestScorerA].scoreB}` : null,
            boxerB: highestScorerB ? `${highestScorerB}: ${userScores[highestScorerB].scoreA}-${userScores[highestScorerB].scoreB}` : null,
        });
    };

    const getRounds = () => {
        const rounds = [...new Set(scorecards.map((item) => item.round))].sort((a, b) => a - b);
        return rounds;
    };

    const getUserScores = (user) => {
        const userScores = scorecards.filter((item) => item.userId.firstName === user);
        const scoresByRound = {};
        userScores.forEach((item) => {
            scoresByRound[item.round] = item.score;
        });
        return scoresByRound;
    };

    const getUsers = () => {
        const users = [...new Set(scorecards.map((item) => item.userId.firstName))];
        return users;
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Scoreboard
            </Typography>
            {matchInfo && (
                <Typography variant="subtitle1" gutterBottom>
                    Current Round: {matchInfo.currentRound} <br />
                    Boxers: {matchInfo.boxerA} vs {matchInfo.boxerB}
                </Typography>
            )}
            <Typography variant="subtitle1" gutterBottom>
                User Scores
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        {getRounds().map((round) => (
                            <TableCell key={round}>Round {round}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getUsers().map((user) => (
                        <TableRow key={user}>
                            <TableCell>{user}</TableCell>
                            {getRounds().map((round) => (
                                <TableCell key={round}>
                                    {getUserScores(user)[round] || ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Average Scores: {averageScores}
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Highest Scorers:
            </Typography>
            <Typography variant="body1" gutterBottom>
                Boxer A: {highestScorers.boxerA || 'N/A'}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Boxer B: {highestScorers.boxerB || 'N/A'}
            </Typography>
        </div>
    );
}

export default Scoreboard;