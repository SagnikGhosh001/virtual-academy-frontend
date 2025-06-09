import React, { useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDept } from "../reducer/DeptSlice";
import { getAllSem } from "../reducer/SemSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // For eye icon
import { toast, ToastContainer } from "react-toastify";
import { registerstudent } from "../reducer/AuthSlice";
import { message, notification } from "antd";

function RegistrationForm() {
    useEffect(() => {
        document.title = "Virtual Academy | Registration";
    }, []);
    const { dept } = useSelector((state) => state?.depts);
    const { sem } = useSelector((state) => state?.sems);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const registerUser = async (data) => {
        try {
            setLoading(true)
            const res = await dispatch(registerstudent(data))


            if (res?.payload?.statusCodeValue === 200) {
                notification.success({ message: "Registration Successfull" })
                navigate("/verifyaccount");
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {

            setLoading(false)

        }
    };

    const onSubmit = async (data) => {
        setLoading(true)
        await registerUser(data);
    };

    useEffect(() => {
        dispatch(getAllDept());
        dispatch(getAllSem());
    }, [dispatch]);

    return (
        <>
            <ToastContainer />


            <Container maxWidth="sm" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Registration Form
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                {...register("name", { required: true })}
                                error={!!errors.name}
                                helperText={errors.name && "Name is required."}
                            />
                        </Grid>

                        {/* Gender */}
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                {...register("gender", { required: true })}
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
                                    Gender is required.
                                </Typography>
                            )}
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                {...register("email", { required: true })}
                                error={!!errors.email}
                                helperText={errors.email && "Email is required."}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                sx={{
                                    '& input::-ms-reveal': {
                                        display: 'none',
                                    },
                                }}
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                {...register("password", { required: true })}
                                error={!!errors.password}
                                helperText={errors.password && "Password is required."}
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

                        {/* Registration Number */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Registration No"
                                variant="outlined"
                                {...register("reg", { required: true })}
                                error={!!errors.reg}
                                helperText={errors.reg && "Registration No is required."}
                            />
                        </Grid>

                        {/* Department */}
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                {...register("deptId", { required: true })}
                                error={!!errors.deptId}
                            >
                                <MenuItem value="" disabled>
                                    Select Department
                                </MenuItem>
                                {dept?.body?.map((listdept) => (
                                    <MenuItem key={listdept.id} value={listdept.id}>
                                        {listdept.deptname}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.deptId && (
                                <Typography color="error" variant="caption">
                                    Department is required.
                                </Typography>
                            )}
                        </Grid>

                        {/* Semester */}
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                {...register("semId", { required: true })}
                                error={!!errors.semId}
                            >
                                <MenuItem value="" disabled>
                                    Select Semester
                                </MenuItem>
                                {sem?.body?.map((listsem) => (
                                    <MenuItem key={listsem.id} value={listsem.id}>
                                        {listsem.semname}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.semId && (
                                <Typography color="error" variant="caption">
                                    Semester is required.
                                </Typography>
                            )}
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress color="info" size="30px" />
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Typography variant="body2" align="center" sx={{ mt: 2, mb:2 }}>
                    For email verification, <Link to={"/verifyaccount"}>click here</Link>.
                </Typography>

                <Typography variant="body2" align="center">
                    Already have an account?{" "}
                    <Link to={"/login"} style={{ color: "#1976d2" }}>
                        Log in
                    </Link>
                </Typography>
            </Container>
        </>
    );
}

export default RegistrationForm;
