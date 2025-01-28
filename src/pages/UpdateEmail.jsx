import React, { useEffect, useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateemail } from '../reducer/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { notification } from 'antd';

const UpdateEmail = () => {
  useEffect(() => {
      document.title = "Virtual Academy | Update Email";
    }, []);
    const { user, loading } = useSelector((state) => state?.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const {
      handleSubmit,
      register,
      reset,  // Add reset to reset form data
      setValue, // Can be used to set form values manually if needed
      formState: { errors },
    } = useForm({
        defaultValues: {
            email: user?.email || '',  
          }
    });
  
    const onSubmit = (data) => {
      const currentUserId = user?.id;
      const payload = { ...data, currentUserId };
  
      dispatch(updateemail({ id: user?.id, userInput: payload })).then((res) => {
        
        if (res?.payload?.statusCodeValue === 200) {
          notification.success({message:'Email Updated Successfully'});
          // setTimeout(() => {
            navigate('/verifyaccount');
          // }, 1000);
        }
      });
    };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Update Your Email
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to change your email? If you change your email, you'll need to verify your account again.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="New Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              {...register('email', { required: true })}
              error={!!errors.email}
              helperText={errors.email && 'Email is required'}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#3f51b5',
                  fontWeight: '500',
                },
              }}
            />
            
            <Button
              color="primary"
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                padding: '12px 0',
                fontSize: '16px',
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              {loading ? <CircularProgress color="info" size="30px" /> : 'Submit'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{mt:2 }}>
              Verify Your Email{" "}
              <a href="/verifyaccount" style={{ color: "#1976d2" }}>
               <u> click here</u>
              </a>
            </Typography>
        </Paper>
        
      </Container>
    </>
  );
};

export default UpdateEmail;
