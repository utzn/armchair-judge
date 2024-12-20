import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    return (
        <Routes>
            {!user ? (
                // If not logged in, redirect to login
                <Route path="*" element={<Login setUser={setUser} />} />
            ) : (
                // If logged in, show the dashboard
                <Route path="/*" element={<Dashboard user={user} setUser={setUser} />} />
            )}
        </Routes>
    );
}

export default App;
