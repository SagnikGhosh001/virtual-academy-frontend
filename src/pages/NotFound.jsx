
import React, { useEffect } from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
      document.title = "Virtual Academy | Not Found 404";
    }, []);
  return (

    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" color="error" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }} component={Link} to="/">
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
