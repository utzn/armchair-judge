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
  const [averageScores, setAverageScores] = useState('');
  const [highestScorers, setHighestScorers] = useState({
    boxerA: null,
    boxerB: null,
  });
  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await fetchMatchInfo();
      await fetchScorecards();
      const interval = setInterval(async () => {
        await fetchMatchInfo();
        await fetchScorecards();
      }, 5000);
      return () => clearInterval(interval);
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (scorecards.length && matchInfo) {
      console.debug('Calculating average scores and highest scorers...');
      calculateAverageScores(scorecards, matchInfo);
      calculateHighestScorers(scorecards, matchInfo);
    }
  }, [scorecards, matchInfo]);

  const fetchMatchInfo = async () => {
    try {
      const response = await axios.get('/api/match');
      console.debug('Fetched match info:', response.data);
      setMatchInfo(response.data);
    } catch (error) {
      console.error('Error fetching match info', error);
    }
  };

  const fetchScorecards = async () => {
    try {
      const response = await axios.get('/api/scorecards');
      console.debug('Fetched scorecards:', response.data);
      setScorecards(response.data);
    } catch (error) {
      console.error('Error fetching scorecards', error);
    }
  };

  const calculateAverageScores = (data, match) => {
    let totalScoreA = 0;
    let totalScoreB = 0;
    const count = data.length;
  
    data.forEach((item) => {
      let [scoreA, scoreB] = item.score.split('-').map(Number);
      if (item.boxer === match.boxerB) {
        [scoreA, scoreB] = [scoreB, scoreA]; // Swap the scores
      }
      totalScoreA += scoreA;
      totalScoreB += scoreB;
    });

    console.debug('Total Score A:', totalScoreA);
    console.debug('Total Score B:', totalScoreB);
    console.debug('Number of scores (count):', count);

    const averageScoreA = (totalScoreA / count).toFixed(2);
    const averageScoreB = (totalScoreB / count).toFixed(2);
    console.debug('Average Score A:', averageScoreA);
    console.debug('Average Score B:', averageScoreB);
    setAverageScores(`${averageScoreA}-${averageScoreB}`);
  };

  const calculateHighestScorers = (data, match) => {
    const userScores = {};
    data.forEach((item) => {
      const user = item.userId.firstName;
      if (!userScores[user]) {
        userScores[user] = { scoreA: 0, scoreB: 0 };
      }
  
      let [scoreA, scoreB] = item.score.split('-').map(Number);
      if (item.boxer === match.boxerB) {
        [scoreA, scoreB] = [scoreB, scoreA]; // Swap the scores
      }
  
      userScores[user].scoreA += scoreA;
      userScores[user].scoreB += scoreB;
    });
  
    let highestScorerA = null;
    let highestScorerB = null;
  
    Object.keys(userScores).forEach((user) => {
      if (
        !highestScorerA ||
        userScores[user].scoreA > userScores[highestScorerA]?.scoreA
      ) {
        highestScorerA = user;
      }
      if (
        !highestScorerB ||
        userScores[user].scoreB > userScores[highestScorerB]?.scoreB
      ) {
        highestScorerB = user;
      }
    });
  
    setHighestScorers({
      boxerA: highestScorerA
        ? `${highestScorerA}: ${userScores[highestScorerA].scoreA}`
        : 'N/A',
      boxerB: highestScorerB
        ? `${highestScorerB}: ${userScores[highestScorerB].scoreB}`
        : 'N/A',
    });
  };

  const getRounds = () => {
    const rounds = [...new Set(scorecards.map((item) => item.round))].sort(
      (a, b) => a - b
    );
    console.debug('Rounds:', rounds);
    return rounds;
  };

  const getUserScores = (user) => {
    const userScores = scorecards.filter(
      (item) => item.userId.firstName === user
    );
    const scoresByRound = {};
    userScores.forEach((item) => {
      let score = item.score;
      if (item.boxer === matchInfo?.boxerB) {
        const [scoreA, scoreB] = score.split('-').map(Number);
        score = `${scoreB}-${scoreA}`; // Swap the scores
      }
      scoresByRound[item.round] = score;
    });
    return scoresByRound;
  };

  const getUsers = () => {
    const users = [
      ...new Set(scorecards.map((item) => item.userId.firstName)),
    ];
    console.debug('Users:', users);
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
        Average Score: {averageScores}
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
        Highest Scorers:
      </Typography>
      <Typography variant="body1" gutterBottom>
        {matchInfo?.boxerA || 'Boxer A'}: {highestScorers?.boxerA || 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {matchInfo?.boxerB || 'Boxer B'}: {highestScorers?.boxerB || 'N/A'}
      </Typography>
    </div>
  );
}

export default Scoreboard;
