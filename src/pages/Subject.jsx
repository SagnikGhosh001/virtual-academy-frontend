import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, FormControlLabel, Switch, MenuItem, Select, FormControl } from '@mui/material';
import { notification, Spin, Rate, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addfedback, deleteFeedback, getallfeedback, updatefeedback } from '../reducer/FeedbackSlice';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { debounce, throttle } from 'lodash';
import { addsub, deletesub, getAllSub, updatesub } from '../reducer/SubSlice';
import { getAllSem } from '../reducer/SemSlice';
import { getAllDept } from '../reducer/DeptSlice';
import { allteacher } from '../reducer/AuthSlice';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

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

const Subject = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Subjects";
      }, []);
    const navigate = useNavigate()
    const { subs, loading } = useSelector((state) => state?.subs);
    const { user, userlist, islogin } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const {
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSubId, setEditSubId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { dept } = useSelector((state) => state?.depts);
    const { sem } = useSelector((state) => state?.sems);
    const handleResize = useCallback(
        throttle(() => {
            // Your DOM manipulation logic here
            console.log('Resize event detected');
        }, 500), [] // Throttle for 500ms
    );

    useResizeObserver(handleResize);

    useEffect(() => {
        dispatch(allteacher())
        dispatch(getAllSub())
        dispatch(getAllSem())
        dispatch(getAllDept())


    }, [dispatch]);

    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            const teacherId = user?.id
            // const teacherChange = user?.id
            const payload = { ...data, teacherId }
            const payloadupdate = { ...payload }
            if (editSubId) {
                const res = await dispatch(updatesub({ id: editSubId, userInput: payloadupdate }))
                // console.log(res);

                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Subject updated successfully!' });

                }
                setEditSubId(null)
            } else {
                const res = await dispatch(addsub(payload))
                if (res?.payload?.statusCodeValue === 201) {

                    notification.success({ message: 'Subject submitted successfully!' });
                }
            }

            reset(); // Reset form fields after submission
            setIsModalOpen(false);
            setIsEditModalOpen(false);

            await dispatch(getAllSub());
        } catch (error) {
            notification.error({ message: 'Failed to submit subject. Try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [selectedSemId, setSelectedSemId] = useState('');

    const filteredRows = (user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') && subs?.length > 0 ? subs.filter(
        (row) =>
            (selectedDeptId ? row.deptname === selectedDeptId : true) &&
            (selectedSemId ? row.semname === selectedSemId : true)
    ) :
        user?.role === 'student' && subs?.length > 0 ? subs.filter(
            (row) =>
                (user?.deptname ? row.deptname === user?.deptname : true) &&
                (user?.semname ? row.semname === user?.semname : true)
        ) : [];

    const handleDeptChange = (event) => {
        setSelectedDeptId(event.target.value);
    };

    const handleSemChange = (event) => {
        setSelectedSemId(event.target.value);
    };
    const columns = [
        { field: 'id', headerName: 'S.No.', width: 80, sortable: false },
        { field: 'subname', headerName: 'Subject', width: 200, sortable: true },
        { field: 'deptname', headerName: 'Department', width: 300, sortable: true },
        { field: 'semname', headerName: 'Semester', width: 250, sortable: true },
        { field: 'teachername', headerName: 'Teacher', width: 250, sortable: true },
        { field: 'createdat', headerName: 'Created At', sortable: true, width: 200 },
        { field: 'modifiedat', headerName: 'Updated At', sortable: true, width: 200 },

        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <div>
                    {
                        user?.role === "hod" || user?.role === "pic" ? (
                            <>
                                <IconButton onClick={(event) => handleEditClick(event, params.row)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(event) => handleDeleteClick(event, params.row.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        ) : null
                    }


                </div>
            ),
        }
    ];

    const handleEditClick = (event, record) => {
        event.stopPropagation();
        setEditSubId(record.id);
        setValue('subname', record.subname);
        setValue('teacherChange', record.teacherStaticId);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (event, id) => {
        event.stopPropagation();
        Modal.confirm({
            title: 'Are you sure you want to delete this subject?',
            onOk: async () => {
                try {
                    const teacherId = user?.id;
                    const payload = { teacherId };
                    const res = await dispatch(deletesub({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Subject deleted successfully!' });
                    }

                    await dispatch(getAllSub());
                } catch (error) {
                    notification.error({ message: 'Failed to delete subject.' });
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

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Subject Page
            </Typography>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                Subject.
            </Typography>
            {(user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic')
                && < Grid container spacing={2} sx={{ marginBottom: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <Select value={selectedDeptId} onChange={handleDeptChange} displayEmpty>
                                <MenuItem value="">
                                    <em>Select Department</em>
                                </MenuItem>
                                {dept?.body?.map((department) => (
                                    <MenuItem key={department.id} value={department.deptname}>
                                        {department.deptname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <Select value={selectedSemId} onChange={handleSemChange} displayEmpty>
                                <MenuItem value="">
                                    <em>Select Semester</em>
                                </MenuItem>
                                {sem?.body?.map((semester) => (
                                    <MenuItem key={semester.id} value={semester.semname}>
                                        {semester.semname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>}
            <Box sx={{ marginTop: '30px' }}>
                <div id="resize-observed-element" style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 15]}
                        pagination
                        disableSelectionOnClick
                        autoHeight
                        onRowClick={(params) => {
                            const subjectId = params.row.id; // Get the selected subject ID
                            const secretKey = 'virtualacademy';
                            const encryptedId = CryptoJS.AES.encrypt(subjectId.toString(), secretKey).toString();
                            const urlSafeEncryptedId = encodeURIComponent(encryptedId);

                            Modal.info({
                                title: 'Select an Action',
                                content: (
                                    <div>
                                        <p>
                                            You are about to view content for the subject: <strong>{params.row.subname}</strong>
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    navigate(`/user/notes/${urlSafeEncryptedId}`);
                                                    Modal.destroyAll();
                                                }}
                                            >
                                                View Notes
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    navigate(`/user/assignments/${urlSafeEncryptedId}`);
                                                    Modal.destroyAll();
                                                }}
                                            >
                                                View Assignments
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    navigate(`/user/attendance/${urlSafeEncryptedId}`);
                                                    Modal.destroyAll();
                                                }}
                                            >
                                                View Attendance
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    navigate(`/user/books/${urlSafeEncryptedId}`);
                                                    Modal.destroyAll();
                                                }}
                                            >
                                                View Books
                                            </Button>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    navigate(`/user/topics/${urlSafeEncryptedId}`);
                                                    Modal.destroyAll();
                                                }}
                                            >
                                                View Topics
                                            </Button>
                                        </div>
                                    </div>
                                ),
                                okText: 'Cancel',
                                onOk: () => { }, // Keeps the modal behavior simple
                            });

                        }}
                    />
                </div>
            </Box>
            {(user?.role === "hod" || user?.role === "pic")
                &&
                <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!islogin}
                    >
                        {islogin ? 'Add Subject' : 'Login First'}
                    </Button>
                </Grid>

            }

            <Modal
                title={editSubId ? 'Edit Subject' : 'Add Subject'}
                open={isEditModalOpen || isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    reset();
                    setEditSubId(null);
                }}
                footer={null}
                width="80%"
                centered
            >
                <Box sx={{ padding: '20px' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {/* Subject Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Subject Name"
                                    variant="outlined"

                                    {...register('subname', { required: 'Subject name is required.' })}
                                    error={!!errors.subname}
                                    helperText={errors.subname?.message}
                                />
                            </Grid>

                            {/* Teacher */}
                            {/* Teacher */}
                            {editSubId && (
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        fullWidth
                                        // defaultValue="" 
                                        displayEmpty
                                        value={watch('teacherChange')||''}
                                        {...register('teacherChange', { required: 'Please select a teacher.' })}
                                        // defaultValue=""
                                        error={!!errors.teacherChange}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Teacher
                                        </MenuItem>
                                        {userlist?.map((teacher) => (
                                            <MenuItem key={teacher.id} value={teacher.id}>
                                                {teacher.email}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.teacherChange && (
                                        <Typography color="error" variant="caption">
                                            {errors.teacherChange.message}
                                        </Typography>
                                    )}
                                </Grid>
                            )}

                            {/* Department */}
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    displayEmpty
                                    defaultValue=""
                                    disabled={editSubId}
                                    {...register('deptId', {
                                        required: editSubId ? false : 'Please select a department.',
                                    })}
                                    error={!!errors.deptId}
                                >
                                    <MenuItem value="" disabled>
                                        Select Department
                                    </MenuItem>
                                    {dept?.body?.map((department) => (
                                        <MenuItem key={department.id} value={department.id}>
                                            {department.deptname}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.deptId && (
                                    <Typography color="error" variant="caption">
                                        {errors.deptId.message}
                                    </Typography>
                                )}
                            </Grid>

                            {/* Semester */}
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    displayEmpty
                                    defaultValue=""
                                    disabled={editSubId}
                                    {...register('semId', {
                                        required: editSubId ? false : 'Please select a semester.',
                                    })}
                                    error={!!errors.semId}
                                >
                                    <MenuItem value="" disabled>
                                        Select Semester
                                    </MenuItem>
                                    {sem?.body?.map((semester) => (
                                        <MenuItem key={semester.id} value={semester.id}>
                                            {semester.semname}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.semId && (
                                    <Typography color="error" variant="caption">
                                        {errors.semId.message}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>

                        {/* Submit Button */}

                        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
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

        </Box >
    );
};

export default Subject;
