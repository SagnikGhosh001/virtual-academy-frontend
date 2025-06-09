import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Card, CardContent, Typography, CardActions, Button, Box, TextField, MenuItem, CircularProgress, Stack } from '@mui/material';
import { Add, BusinessOutlined, Delete, Edit } from '@mui/icons-material';
import { Collapse, Modal, notification, Select, Spin } from 'antd';
import { getAllSem } from '../reducer/SemSlice';
import { useForm } from 'react-hook-form';
import { adddept, deleteDepartmentSemesterById, deletedept, getAllDept, updateDept } from '../reducer/DeptSlice';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const AllDept = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Department";
    }, []);
    const { dept, loading } = useSelector((state) => state?.depts);
    const { user, islogin } = useSelector((state) => state.auth);
    const { sem } = useSelector((state) => state?.sems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState({ id: null, deptname: '', semId: '' });
    const [associatedSemesters, setAssociatedSemesters] = useState([]);
    const [submitSemesterLoading, setSubmitSemesterLoading] = useState(false);
    // const [editDeptId, setEditDeptId] = useState(null);

    const dispatch = useDispatch();
    const {
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        dispatch(getAllDept());
        dispatch(getAllSem());
    }, [dispatch]);
    const navigate = useNavigate()

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormSubmit = async (data) => {
        const departmentData = {
            deptname: data.deptname,
            semId: data.semId,
            userid: user?.id,
        };
        const res = await dispatch(adddept(departmentData));

        if (res?.payload?.statusCodeValue === 200) {
            notification.success({ message: 'Department Added Successfully' });
        }
        await dispatch(getAllDept());
        handleCloseModal();
        reset();
    };

    const handleOpenEditModal = (dept) => {
        setSelectedDept(dept);
        setValue('deptname', dept.deptname || '');
        setValue('semId', dept?.semStaticId || '');
        setAssociatedSemesters(dept.sem?.map(s => s.id) || []);
        setEditModalOpen(true);
    };


    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        reset();
    };
    // const handleEditClick = (record) => {
    //     setEditDeptId(record.id);
    //     const departmentSemesters = record.semesters || []; // Assuming your department has semesters
    //     setAssociatedSemesters(departmentSemesters.map(s => s.id));
    //     setEditModalOpen(true); // Correct

    // };
    const handleSemesterDelete = async (data) => {
        const payload = {
            semId: data.semId,
            userid: user?.id,
        };
        setSubmitSemesterLoading(true);
        try {
            const res = await dispatch(deleteDepartmentSemesterById({ id: selectedDept.id, userInput: payload }))
            if (res?.payload?.statusCodeValue === 200) {
                notification.success({ message: 'Semester removed from department successfully!' });
            }

            await dispatch(getAllDept());
            setAssociatedSemesters(associatedSemesters.filter(id => id !== data.semId));
            setValue('semId', '');
        } catch {
            notification.error({ message: 'Failed to remove semester from department.' });
        } finally {
            setSubmitSemesterLoading(false);
        }
    };

    const handleEditFormSubmit = async (data) => {
        const payload = {
            deptname: data.deptname,
            semId: data.semId,
            userid: user?.id,
        };
        try {
            const res = await dispatch(updateDept({ id: selectedDept.id, userInput: payload }))
            if (res?.payload?.statusCodeValue === 200) {
                notification.success({ message: 'Department updated successfully!' });
            }

            await dispatch(getAllDept());
            handleCloseEditModal();
        } catch {
            notification.error({ message: 'Failed to update department.' });
        }
    };

    const handleDeleteDept = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this department?',
            onOk: async () => {
                try {
                    const userid = user?.id;
                    const payload = { userid };
                    const res = await dispatch(deletedept({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Department deleted successfully!' });
                    }

                    await dispatch(getAllDept());
                } catch (error) {
                    notification.error({ message: 'Failed to delete department.' });
                }
            },
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    const handleAddDept = () => {
        setIsModalOpen(true)
        reset({
            deptname: '',
            semId: ''
        })
    }
    return (
        <Box sx={{ padding: '20px', paddingLeft: '45px' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'center', sm: 'center' }}
                spacing={2}
                sx={{ mb: 2 }}
            >
                {(user?.role === 'admin' || user?.role === 'pic') && (
                    <>
                        <Typography variant="h4" textAlign="center" gutterBottom>
                            Manage Departments
                        </Typography>
                        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddDept}>
                            Add Department
                        </Button>
                    </>
                )}
            </Stack>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Departments
            </Typography>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                Explore the various departments and their offerings.
            </Typography>
            <Grid container spacing={10} sx={{ marginTop: '20px' }}>
                {dept?.body?.map((listdept) => (
                    <Grid item xs={12} sm={6} md={4} key={listdept.id}>
                        <Card sx={{
                            maxWidth: 400,
                            textAlign: 'center',
                            boxShadow: 3,
                            height: 300,
                            ':hover': {
                                boxShadow: 20,
                            },

                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                <BusinessOutlined style={{ fontSize: 60, color: '#1976d2' }} />
                            </Box>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {listdept.deptname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Discover more about the {listdept.deptname} department.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                {islogin && <Button size="small" color="primary" variant="contained"
                                    onClick={() => {
                                        const deptId = listdept.id
                                        const secretKey = 'virtualacademy';
                                        const encryptedId = CryptoJS.AES.encrypt(deptId.toString(), secretKey).toString();
                                        const urlSafeEncryptedId = encodeURIComponent(encryptedId);
                                        navigate(`/syllabus/${urlSafeEncryptedId}`);
                                    }}>
                                    View Syllabus
                                </Button>}
                                {/* <Button size="small" color="secondary" variant="outlined">
                                    Contact
                                </Button> */}
                            </CardActions>
                            {(user?.role === 'admin' || user?.role === 'pic') && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 1 }}>
                                    <Edit sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleOpenEditModal(listdept)} />
                                    <Delete sx={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteDept(listdept.id)} />
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal
                title="Add New Department"
                open={isModalOpen}
                onOk={handleSubmit(handleFormSubmit)}
                onCancel={handleCloseModal}
                okText="Add"
                cancelText="Cancel"
            >
                <TextField
                    fullWidth
                    margin="normal"
                    label="Department Name"
                    name="deptname"
                    // value={watch('deptname')||''}
                    {...register('deptname', { required: 'Department name is required.' })}
                    error={!!errors.deptname}
                    helperText={errors.deptname?.message}
                />
                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Select Semester"
                    name="semId"
                    defaultValue=""
                    // value={watch('semId')||''}
                    {...register('semId', { required: 'Please select a semester.' })}
                    error={!!errors.semId}
                >
                    <MenuItem value="" disabled>
                        Select Semester
                    </MenuItem>
                    {sem?.body?.map((sem) => (
                        <MenuItem key={sem.id} value={sem.id}>
                            {sem.semname}
                        </MenuItem>
                    ))}
                </TextField>
            </Modal>
            <Modal
                title="Edit Department"
                open={editModalOpen}
                onOk={handleSubmit(handleEditFormSubmit)}
                onCancel={handleCloseEditModal}
                okText="Update"
                cancelText="Cancel"
            >
                <TextField
                    fullWidth
                    margin="normal"
                    label="Department Name"
                    name="deptname"
                    defaultValue=""
                    {...register('deptname', { required: 'Department name is required.' })}
                    error={!!errors.deptname}
                    helperText={errors.deptname?.message}
                />
                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Select Semester"
                    name="semId"
                    value={watch('semId') || ''}
                    {...register('semId', { required: 'Please select a semester.' })}
                    error={!!errors.semId}
                >
                    {sem?.body?.map((sem) => (
                        <MenuItem key={sem.id} value={sem.id}>
                            {sem.semname}
                        </MenuItem>
                    ))}
                </TextField>
                <form onSubmit={handleSubmit(handleSemesterDelete)}>
                    <Collapse style={{ marginBottom: '16px', marginTop: '16px' }}>
                        <Collapse.Panel header="Delete Semester of This Department" >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        defaultValue=""
                                        label="Select semester"
                                        sx={{ minWidth: 200 }}
                                        {...register("semId", { required: true })}
                                        error={!!errors.semId}
                                    >
                                        <MenuItem value="" disabled>Select semester</MenuItem>
                                        {sem?.body?.filter(s => associatedSemesters.includes(s.id)).map((listsem) => (
                                            <MenuItem key={listsem.id} value={listsem.id}>{listsem.semname}</MenuItem>
                                        ))}
                                    </TextField>

                                    {errors.semId && (
                                        <Typography color="error" variant="caption">Semester is required.</Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button type="submit" variant="contained" color="primary" disabled={submitSemesterLoading}>
                                        {submitSemesterLoading ? <CircularProgress size={24} /> : 'Submit'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Collapse.Panel>
                    </Collapse>
                </form>

            </Modal>
        </Box>
    );
};

export default AllDept;
