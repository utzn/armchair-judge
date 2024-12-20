import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import axios from 'axios';

// Configure Axios to send cookies with requests
axios.defaults.withCredentials = true;

// Create custom theme
const theme = createTheme({
    palette: {
        background: {
            default: '#F0F0F0', // Grey/pastel background
        },
        primary: {
            main: '#607d8b', // Pastel blue-grey
        },
        secondary: {
            main: '#ffb74d', // Pastel orange
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </BrowserRouter>
);