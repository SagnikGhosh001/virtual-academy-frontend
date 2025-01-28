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
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDept } from "../reducer/DeptSlice";
import { getAllSem } from "../reducer/SemSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // For eye icon
import { toast, ToastContainer } from "react-toastify";
import { addTeacher } from "../reducer/AuthSlice";
import { message, notification } from "antd";

function AddTeacher() {
    useEffect(() => {
        document.title = "Virtual Academy | Add Teacher";
      }, []);
    const { dept } = useSelector((state) => state?.depts);
    const { sem } = useSelector((state) => state?.sems);
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();
    const navigate = useNavigate();
    const { user,loading } = useSelector((state) => state?.auth);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleClickShowPassword = () => setShowPassword((prev) => !prev); // Toggle the password visibility
    const handleMouseDownPassword = (event) => event.preventDefault(); // Prevent the mouse down event

    useEffect(() => {
        dispatch(getAllDept());
        dispatch(getAllSem());
    }, [dispatch]);
    const onSubmit = async (data) => {
        const userId = user?.id;
        const payload = { ...data, userId };
        try {
          let res
          if(user?.role==='admin' || user?.role==='pic'){
            res = await dispatch(addTeacher( {userInput:payload} ));
          }
            // console.log(res?.payload?.statusCodeValue);
            
          if (res?.payload?.statusCodeValue === 200) {
            notification.success({message:"Teacher Added successfully."});
            reset()
            // window.location.reload();
          }
        //   else {
        //     toast.error("Try with different Email");
        //   }
        } catch (error) {
          notification.error({message:"Error updating profile."});
        //   console.error(error);
        }
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
                    Add Teacher
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
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"} // Toggle between text and password type
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

                        {/* Department */}
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                defaultValue=""
                                displayEmpty
                                {...register("deptId", { required: true })}
                                error={!!errors.dept}
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
                            {errors.dept && (
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
                                error={!!errors.sem}
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
                            {errors.sem && (
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
                            >
                                {loading ? (
                                    <CircularProgress color="info" size="30px" />
                                ) : (
                                    'Add'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}

export default AddTeacher;
