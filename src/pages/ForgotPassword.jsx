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
    CircularProgress,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotpassword, sendOtpToEmail } from '../reducer/AuthSlice';
import { notification } from 'antd';

const ForgotPassword = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Forget Password";
      }, []);
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const sendOtp = async (data) => {
        try {
            setLoading(true);
            dispatch(sendOtpToEmail(data))
            setEmail(data.email);
            setEmailSent(true);
            notification.success({ message: "OTP sent successfully! Please check your email." });
        } catch (error) {
            notification.error({ message: error.response?.data?.message || "Failed to send OTP. Please try again." });
        } finally {
            setLoading(false);
        }
    };
    const verifyOtpAndResetPassword = async (data) => {
        try {
            setLoading(true);
            const payload = { email, otp: data.otp, password: data.password };
            await dispatch(forgotpassword(payload)).then((res) => {
                // console.log(res?.payload?.statusCodeValue);

                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Password Updated Successfully' });
                    // setTimeout(() => {
                    navigate('/user/settings');
                    // }, 1000);
                }
                //  else if (res?.type === 'forgotpassword/slice/rejected') {
                //     toast.error(res?.payload);

                // } else {
                //     toast.error('Please enter correct details');
                // }
            });
        } catch (error) {
            notification.error({ message: error.message || "Failed to reset password. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <Container maxWidth="xs" sx={{ mt: 5 }}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Forgot Password
                    </Typography>

                    {/* Step 1: Enter Email */}
                    {!emailSent && (
                        <Box component="form" onSubmit={handleSubmit(sendOtp)} noValidate>
                            <Grid container spacing={2}>
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
                                <Grid item xs={12}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        fullWidth
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
                                        {loading ? <CircularProgress color="info" size="30px" /> : 'Send OTP'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Step 2: Enter OTP and New Password */}
                    {emailSent && (
                        <Box component="form" onSubmit={handleSubmit(verifyOtpAndResetPassword)} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="OTP"
                                        type="tel"
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
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type={showPassword ? "text" : "password"}
                                        variant="outlined"
                                        margin="normal"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                                        })}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        variant="outlined"
                                        margin="normal"
                                        {...register("confirmPassword", {
                                            required: "Confirm Password is required",
                                            validate: (value) => value === watch('password') || "Passwords do not match",
                                        })}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
                                <Grid item xs={12}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        fullWidth
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
                                        {loading ? <CircularProgress color="info" size="30px" /> : 'Reset Password'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default ForgotPassword;
