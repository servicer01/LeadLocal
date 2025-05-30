import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

const Leads: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Leads Management
        </Typography>
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Your leads dashboard will be displayed here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Leads;