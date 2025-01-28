import React, { useEffect } from 'react';
import { Card, Typography, Grid, Button, Box } from '@mui/material';
import { SettingOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Virtual Academy | Settings";
  }, []);
  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Card elevation={6} sx={{ maxWidth: 600, width: '100%', padding: '20px', borderRadius: '12px' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          <SettingOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1976d2' }} />
          Settings
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ marginBottom: '20px' }}>
          Manage your account settings and preferences
        </Typography>

        <Grid container spacing={3}>
          {/* Update Profile */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="info"
              startIcon={<UserOutlined />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => handleRedirect('/user/updateprofile')}
            >
              Update Profile
            </Button>
          </Grid>

          {/* Update Password */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<LockOutlined />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => handleRedirect('/user/updatepassword')}
            >
              Update Password
            </Button>
          </Grid>

          {/* Update Email */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<MailOutlined />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => handleRedirect('/user/updateemail')}
            >
              Update Email
            </Button>
          </Grid>

          {/* Verify Email */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={<MailOutlined />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => handleRedirect('/verifyaccount')}
            >
              Verify Email
            </Button>
          </Grid>

          {/* Update Phone Number */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<PhoneOutlined />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => handleRedirect('/user/addphone')}
            >
              Update Phone Number
            </Button>
          </Grid>


          {/* Update Password */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<LockOutlined />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => handleRedirect('/forgotpassword')}
            >
              Forgot Password
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

export default Settings;
