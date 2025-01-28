import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { sendOtpToEmail, verifyotp } from '../reducer/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { message, notification } from 'antd';

const VerifyAccount = () => {
  useEffect(() => {
      document.title = "Virtual Academy | Verify Account";
    }, []);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  // const { user, error } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const sendotp = async (data) => {
    try {
      const res=await dispatch(sendOtpToEmail(data))
      // console.log(res);
      
      if(res?.payload?.status===200){
        setShowOtpBox(true);
        setEmailDisabled(true);
        setEmail(data.email);
        setLoading(false)
        notification.success({message:"Check your email for otp."})
      }else{
        // notification.error({message:"Provide a valid email"})
        setLoading(false)
      }
    } catch (error) {
      // notification.error({message:error.response.data.message)}
      setLoading(false)
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      const payload = { ...data, email };
      const res = await dispatch(verifyotp(payload))
      console.log(res);
      
      if (res?.payload?.status === 200) {
        setLoading1(false);
        notification.success({message:"Email verified successfully!"});
        navigate("/login");
      } else {
        setLoading1(false);
        // notification.error({message:"Invalid OTP. Please try again."});
      }
    } catch (error) {
      setLoading1(false);
      
      // if (error.response) {
      //   const statusCode = error.response.status;
      //   if (statusCode === 400) {
      //     notification.error({message:"Invalid OTP. Please try again."});
      //   } else if (statusCode === 500) {
      //     notification.error({message:"Server error. Please try again later."});
      //   }
      // } else if (error.request) {
      //   notification.error({message:"No response from server. Please try again."});
      // } else {
      //   notification.error({message:`Error: ${error.message}`});
      // }
    }
  };
  

  const handleEmailSubmit = async (data) => {
    setLoading(true)
    await sendotp(data);
  };

  const handleOtpSubmit = async (data) => {
    setLoading1(true)
    await handleVerifyOtp(data);
  };

  const otpbox = () => (
    <>
      <ToastContainer />

      <Box
        component="form"
        onSubmit={handleSubmit(handleOtpSubmit)}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 2,
          backgroundColor: '#fafafa',
          boxShadow: 4,
          border: '1px solid #e0e0e0',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
          Enter the OTP sent to your email:
        </Typography>
        <TextField
          fullWidth
          type="tel"
          label="OTP"
          variant="outlined"
          margin="normal"
          {...register("otp", { required: "OTP is required" })}
          error={!!errors.otp}
          helperText={errors.otp?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#3f51b5',
              fontWeight: '500',
            },
            '& .MuiFormHelperText-root': {
              color: 'red',
              fontSize: '0.875rem',
            },
          }}
        />
        <input type="hidden" name="email" value={email} />
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
          {loading1 ? (
            <CircularProgress color="info" size="30px" />
          ) : (
            'Submit OTP'
          )}
        </Button>
      </Box>
    </>
  );

  return (
    <>
      <ToastContainer />

      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Verify Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit(handleEmailSubmit)} noValidate>
            <Grid container spacing={2}>
              {/* Email Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={emailDisabled}
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
              </Grid>
              {/* Submit Button for Email */}
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={emailDisabled}
                  sx={{
                    padding: '12px 0',
                    fontSize: '16px',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress color="info" size="30px" />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* Show OTP Box if triggered */}
          {showOtpBox && otpbox()}
        </Paper>
      </Container>
    </>
  );
};

export default VerifyAccount;
