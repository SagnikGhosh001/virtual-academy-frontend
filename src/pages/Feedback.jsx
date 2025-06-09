import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, FormControlLabel, Switch, Stack, Avatar } from '@mui/material';
import { notification, Spin, Rate, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addfedback, deleteFeedback, getallfeedback, updatefeedback } from '../reducer/FeedbackSlice';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { debounce, throttle } from 'lodash';
import Lottie from 'lottie-react';
import birdMailAnimation from '../asset/Animation - 1749019821225.json';
import birdMessgaeAnimation from '../asset/Animation - 1749020458751.json';
// Custom hook to handle resize observer
const useResizeObserver = (callback) => {
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    callback();
                }
            }
        });

        // Optionally, you can limit to specific elements
        const observedElement = document.getElementById('resize-observed-element'); // replace with your specific ID or reference
        if (observedElement) {
            observerRef.current.observe(observedElement);
        }

        return () => {
            observerRef.current.disconnect(); // Cleanup observer on unmount
        };
    }, [callback]);

    return observerRef.current;
};

const Feedback = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Feedbacks";
    }, []);
    const { feedbacks, loading } = useSelector((state) => state?.feedbacks);
    const { user, islogin } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const {
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: user?.email || '', // Initialize with user's email if logged in, else empty
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFeedbackId, setEditFeedbackId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showUserFeedbackFirst, setShowUserFeedbackFirst] = useState(true);

    const handleResize = useCallback(
        throttle(() => {
            // Your DOM manipulation logic here
            console.log('Resize event detected');
        }, 500), [] // Throttle for 500ms
    );

    useResizeObserver(handleResize);

    useEffect(() => {
        dispatch(getallfeedback());
    }, [dispatch]);

    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            if (editFeedbackId) {
                const res = await dispatch(updatefeedback({ id: editFeedbackId, userInput: data }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Feedback updated successfully!' });
                }

                setEditFeedbackId(null)
            } else {
                const res = await dispatch(addfedback(data))
                if (res?.payload?.statusCodeValue === 201) {
                    notification.success({ message: 'Feedback submitted successfully!' });
                }

            }
            reset(); // Reset form fields after submission
            setIsModalOpen(false);
            setIsEditModalOpen(false);

            await dispatch(getallfeedback());
        } catch (error) {
            notification.error({ message: 'Failed to submit feedback. Try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        setValue('email', user?.email)
    })

    const sortedFeedbacks = showUserFeedbackFirst
        ? [
            ...((Array.isArray(feedbacks) ? feedbacks : []).filter((feedback) => feedback.emailId === user?.email)),
            ...((Array.isArray(feedbacks) ? feedbacks : []).filter((feedback) => feedback.emailId !== user?.email)),
        ]
        : (Array.isArray(feedbacks) ? feedbacks : []);


    // const columns = [
    //     { field: 'serialNo', headerName: 'S.No.', width: 80, sortable: false, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    //     { field: 'msg', headerName: 'Message', width: 400, sortable: true },
    //     { field: 'rating', headerName: 'Rating', width: 200, renderCell: (params) => <Rate value={params.value} disabled /> },
    //     { field: 'emailId', headerName: 'Email ID', width: 350, sortable: true },
    //     { field: 'createdAt', headerName: 'Created At', sortable: true, width: 200 },
    //     { field: 'modifiedAt', headerName: 'Updated At', sortable: true, width: 200 },

    //     {
    //         field: 'action',
    //         headerName: 'Action',
    //         width: 150,
    //         sortable: false,
    //         renderCell: (params) => (
    //             <div>
    //                 {user?.email === params.row.emailId ? (
    //                     <>
    //                         <IconButton onClick={() => handleEditClick(params.row)}>
    //                             <EditIcon />
    //                         </IconButton>
    //                         <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
    //                             <DeleteIcon />
    //                         </IconButton>
    //                     </>
    //                 ) : user?.role === 'admin' ? (
    //                     <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
    //                         <DeleteIcon />
    //                     </IconButton>
    //                 ) : null}
    //             </div>
    //         ),
    //     }
    // ];

    const handleEditClick = (record) => {
        setEditFeedbackId(record.id);
        setValue('msg', record.msg);
        setValue('rating', record.rating);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this feedback?',
            onOk: async () => {
                try {
                    const email = user?.email;
                    const payload = { email };
                    const res = await dispatch(deleteFeedback({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Feedback deleted successfully!' });
                    }

                    await dispatch(getallfeedback());
                } catch (error) {
                    notification.error({ message: 'Failed to delete feedback.' });
                }
            },
        })
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }
    const FeedbackBirdVisual = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Lottie animationData={birdMailAnimation} loop={true} style={{ width: 200, height: 200 }} />
        </Box>
    );
    const FeedbackBirdMessage = () => (
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Lottie animationData={birdMessgaeAnimation} loop={true} style={{ top: '40%', right: '0%', width: 200, height: 100 }} />
        </Box>
    );
    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container alignItems="center" spacing={2} sx={{ mb: 3 }}>
                {/* Left spacer */}
                <Grid item xs={false} sm={2} md={3} />
                <Grid item xs={12} sm={8} md={6}>
                    <Typography variant="h4" textAlign="center" gutterBottom >
                        Feedbacks
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={2}
                    md={3}
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        mt: { sm: 0 }
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!islogin}

                    >
                        {islogin ? 'Add Feedback' : 'Login First'}

                    </Button>
                </Grid>
            </Grid>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                View and share feedback about our platform.
            </Typography>

            <Box sx={{ marginTop: '30px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControlLabel
                        control={<Switch checked={showUserFeedbackFirst} onChange={() => setShowUserFeedbackFirst(!showUserFeedbackFirst)} />}
                        label="Show my feedback first"
                    />
                    {sortedFeedbacks.length !== 0 && (
                        <FeedbackBirdMessage />
                    )}
                </Box>


                {sortedFeedbacks.length === 0 && (
                    <>
                        <Typography textAlign="center" variant="h6">No feedback yet!</Typography>
                        <FeedbackBirdVisual />
                    </>
                )}

                <Stack spacing={3} sx={{
                    mt: 3,
                    maxWidth: 700,
                    mx: 'auto',

                }} id="resize-observed-element">
                    {sortedFeedbacks.map((feedback) => (

                        <Box
                            key={feedback.id}
                            sx={{
                                borderRadius: 2,
                                padding: 3,
                                boxShadow: 3,
                                backgroundColor: 'white',
                                width: '100%',
                                ':hover': {
                                    boxShadow: 10,
                                    borderRadius: 2
                                },
                            }}
                        >
                            <Grid container spacing={2} alignItems="flex-start">
                                <Grid item>
                                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                                        {feedback.emailId?.[0]?.toUpperCase() || '?'}
                                    </Avatar>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {feedback.emailId}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(feedback.createdAt).toLocaleString()}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {feedback.msg}
                                        </Typography>
                                    </Box>
                                    <Rate value={feedback.rating} disabled style={{ marginTop: 8 }} />
                                </Grid>
                                <Grid item>
                                    {(user?.email === feedback.emailId || user?.role === 'admin') && (
                                        <Stack direction="row" spacing={1}>
                                            {user?.email === feedback.emailId && (
                                                <IconButton size="small" onClick={() => handleEditClick(feedback)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(feedback.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Stack>

            </Box>


            <Modal
                title={editFeedbackId ? 'Edit Feedback' : 'Add Feedback'}
                open={isEditModalOpen || isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    setValue('email', user?.email); // Set the email field correctly when modal closes
                    reset(); // Ensure other fields are reset
                    setEditFeedbackId(null);
                }}
                footer={null}
                width="80%"
                centered
            >
                <Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Your Email"
                            value={user?.email}
                            {...register('email', { required: 'Email is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            margin="normal"
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Your Feedback"
                            {...register('msg', { required: 'Feedback message is required' })}
                            error={!!errors.msg}
                            helperText={errors.msg?.message}
                            margin="normal"
                        />
                        <Typography variant="subtitle1" sx={{ marginTop: 2, marginBottom: 1 }}>
                            Rating:
                        </Typography>
                        <Rate value={watch('rating')} onChange={(value) => setValue('rating', value)} />
                        {errors.rating && (
                            <Typography color="error" variant="caption">
                                Rating is required
                            </Typography>
                        )}

                        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={submitLoading}
                            >
                                {submitLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default Feedback;
