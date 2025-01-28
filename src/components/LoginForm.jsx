import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, online } from "../reducer/AuthSlice";
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { notification } from "antd";


function LoginForm() {
  useEffect(() => {
      document.title = "Virtual Academy | Login";
    }, []);
  const { islogin, loading } = useSelector((state) => state?.auth);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
const { user } = useSelector((state) => state.auth);

  const onSubmit = (data) => {


    dispatch(login(data)).then((res) => {
      if (res?.payload?.statusCodeValue === 200) {
          const id=res?.payload?.body?.user?.id
          dispatch(online(id))
        notification.success({message:"Login Successfull"})
      } 
    });
  };
  useEffect(() => {


    if (islogin) {
      navigate("/user/dashboard");
    }
  }, [islogin, navigate])
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              margin="normal"
              {...register("email", { required: true })}
              error={!!errors.email}
              helperText={errors.email && "Email is required"}
              sx={{ mb: 2 }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              {...register("password", { required: true })}
              error={!!errors.password}
              helperText={errors.password && "Password is required"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
            >
              {loading ? (

                <CircularProgress color="info" size="30px" />
              ) : (
                'Submit'
              )}
            </Button>

            {/* Forgot Password Link */}
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 2 }}
            >
              <Link to={"/forgotpassword"}>Forgot Password?</Link>
            </Typography>

            {/* Email Verification Link */}
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              Didn't receive an email verification?{" "}
              <Link to={"/verifyaccount"} style={{ color: "#1976d2" }}>
                Resend Verification Email
              </Link>
            </Typography>

            {/* Sign Up Link */}
            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <Link to={"/register"} style={{ color: "#1976d2" }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default LoginForm;
