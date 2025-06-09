import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminupdate, studentupdate, teacherupdate } from "../reducer/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { message, notification } from "antd";

function UpdateProfile() {
  useEffect(() => {
      document.title = "Virtual Academy | Update Profile";
    }, []);
  const { user,loading } = useSelector((state) => state?.auth);
  const { handleSubmit, register, formState: { errors }, setValue,watch } = useForm({
    defaultValues: {
      name: user?.name || '', 
      gender: user?.gender || '' 
    }
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const onSubmit = async (data) => {
    const userId = user?.id;
    const userid = user?.id;
    const payload = { ...data, userId };
    const payloadadmin = { ...data, userid };
    try {
      let res
      if(user?.role==='student'){
        res = await dispatch(studentupdate({ id: userId, userInput: payload }));
      }
      else if(user?.role==='admin'){
        res = await dispatch(adminupdate({ id: userid, userInput: payloadadmin }));
      }
      else if(user?.role==='hod' ||user?.role==='pic'||user?.role==='teacher'){
        res = await dispatch(teacherupdate({ id: userid, userInput: payload }));
      }

        
      if (res?.payload?.statusCodeValue === 200) {
        notification.success({message:"Profile updated successfully."});
        // setTimeout(() => {
          navigate('/user/profile')
        // }, 1000);
        // window.location.reload();
      }
      
     
    } catch (error) {
      notification.error({message:"Error updating profile."});
      console.error(error);
    }
  };

  useEffect(() => {

    if (user) {
      setValue('name', user.name); 
      setValue('gender', user.gender);
    }
  }, [user, setValue]);
  return (
    <>
      <ToastContainer />
      <Container maxWidth="xs" sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            backgroundColor: "background.default",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Update Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name Field */}
            <TextField
              fullWidth
              label="Name"
              type="text"
              margin="normal"
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors.name && "Name is required"}
              sx={{ mb: 2 }}
            />

            {/* Gender Field */}
            <TextField
              fullWidth
              label="Gender"
              select
              margin="normal"
              value={watch('gender')||''}
              {...register("gender", { required: true })}
              error={!!errors.gender}
              helperText={errors.gender && "Gender is required"}
              sx={{ mb: 3 }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Others</MenuItem>
            </TextField>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
            {loading ? (
                <CircularProgress color="info" size="30px" />
              ) : (
                'Update Profile'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default UpdateProfile;
