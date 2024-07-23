import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navigation />
        <Outlet />
    </Box>
  );
}

export default App;
