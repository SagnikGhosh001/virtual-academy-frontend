import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material';


import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';

import { updateemail, updatephone } from '../reducer/AuthSlice';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message, notification } from 'antd';

function AddPhone() {
  useEffect(() => {
    document.title = "Virtual Academy | Add Mobile";
  }, []);
  const { user, loading } = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    reset,  // Add reset to reset form data
    setValue
    , // Can be used to set form values manually if needed
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: user?.phone || '',
    }
  });

  const onSubmit = (data) => {
    const currentUserId = user?.id;
    const payload = { ...data, currentUserId };

    dispatch(updatephone({ id: user?.id, userInput: payload })).then((res) => {
      // console.log (res?.payload?.statusCodeValue);

      if (res?.payload?.statusCodeValue === 200) {
        notification.success({ message: 'Phone Updated Successfully' });
        // setTimeout(() => {
        navigate('/user/settings');
        // }, 1000);
      }
      // else if (res?.type === 'updatephone/slice/rejected') {
      //   toast.error(res?.payload);
      //   reset({ email: ''}); 
      // } 
      else {
        // notification.error({message:'Please enter correct details'});
        reset({ email: '' });
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            {
              user?.phone ? 'Update Your Phone' : 'Add Phone'
            }

          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This feature is currently unavailable!!!
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="New Phone"
              type="tel"
              variant="outlined"
              margin="normal"
              {...register('phone', {
                required: 'Phone no is required', pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number."
                }
              })
              }
              error={!!errors.phone}
              helperText={errors.phone?.message}
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
        </Paper>

      </Container>
    </>
  )
}

export default AddPhone