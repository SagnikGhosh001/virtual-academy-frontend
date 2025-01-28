import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { notification, Spin } from 'antd';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { updatepassword } from '../reducer/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function UpdatePassword() {
  useEffect(() => {
      document.title = "Virtual Academy | Update Password";
    }, []);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const { user, loading } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    reset,  // Add reset to reset form data
    setValue, // Can be used to set form values manually if needed
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = user?.email;
    const currentUserId = user?.id;
    const payload = { ...data, email, currentUserId };

    dispatch(updatepassword({ id: user?.id, userInput: payload })).then((res) => {
      if (res?.payload?.statusCodeValue === 200) {
        notification.success({message:'Password Updated Successfully'});
        // setTimeout(() => {
          navigate('/user/profile');
        // }, 1000);
      } 
    });
  };

  return (
    <>
      <ToastContainer />
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
        <Card elevation={6} sx={{ maxWidth: 400, width: '100%', borderRadius: '12px' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 3,
              }}
            >
              <LockOutlined sx={{ fontSize: 50, color: '#1976d2', marginBottom: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Update Password
              </Typography>
            </Box>

            {/* Current Password */}
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              {...register('password', { required: true })}
              error={!!errors.password}
              helperText={errors.password && 'Password is required'}
              sx={{ marginBottom: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* New Password */}
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              {...register('changePassword', { required: true })}
              error={!!errors.changePassword}
              helperText={errors.changePassword && 'Password is required'}
              sx={{ marginBottom: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{
                padding: '10px 20px',
                textTransform: 'none',
              }}
              onClick={handleSubmit(onSubmit)}
            >
              {loading ? (
                <CircularProgress color="info" size="30px" />
              ) : (
                'Update Password'
              )}
            </Button>
            
          </CardContent>
          <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 2 }}
            >
              <a href="/forgotpassword">Forgot Password?</a>
            </Typography>
        </Card>
      </Box>
    </>
  );
}

export default UpdatePassword;
