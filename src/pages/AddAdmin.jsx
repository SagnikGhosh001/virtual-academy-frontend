import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addadmin } from '../reducer/AuthSlice';
import { message, notification } from 'antd';

function AddAdmin() {
    useEffect(() => {
        document.title = "Virtual Academy | Add Admin";
      }, []);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const onSubmit = async (data) => {
        const userid = user?.id;
        const payload = { ...data, userid };
        try {
            if (user?.role === 'admin') {
                const res = await dispatch(addadmin(payload));
                // console.log(res?.payload?.statusCodeValue);
                
                if (res?.payload?.statusCodeValue === 201) {
                    notification.success({message:"Admin added successfully."});
                    reset()
                    // setTimeout(() => {
                        // navigate('/user/dashboard');
                    // }, 1000);
                }
                //  else {
                //     toast.error("Failed to add admin. Please try again.");
                // }
            }
            //  else {
            //     toast.error("You do not have permission to perform this action.");
            // }
        } 
        catch (error) {
            notification.error({message:"Error adding admin."});
            console.error(error);
        }
    };

    return (
        <>
            <ToastContainer />
            <Container maxWidth="sm" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Add Admin
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                {...register("name", { required: "Name is required." })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                {...register("gender", { required: "Gender is required." })}
                                error={!!errors.gender}
                            >
                                <MenuItem value="" disabled>
                                    Select Gender
                                </MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </Select>
                            {errors.gender && (
                                <Typography color="error" variant="caption">
                                    {errors.gender.message}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                {...register("email", { required: "Email is required." })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                {...register("password", { required: "Password is required." })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone No"
                                variant="outlined"
                                {...register("phone", {
                                    required: "Phone No is required.",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Enter a valid 10-digit phone number."
                                    }
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {loading ? <CircularProgress color="info" size="30px" /> : 'Add'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}

export default AddAdmin;
