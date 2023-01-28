import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function MyAppBar() {
  return (
    <Box sx={{ flexGrow: 1, color: 'primary.main'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Image Anotation App
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}