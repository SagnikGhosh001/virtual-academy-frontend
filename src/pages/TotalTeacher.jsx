import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Grid, IconButton, FormControlLabel, Switch, CircularProgress, MenuItem,
    Select,
} from '@mui/material';
import { notification, Modal, Spin, Collapse } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from @mui/x-data-grid
import { teacherupdateothers, allteacher, deleteTeacher, getPic, deleteTeacherSemesterById, deleteTeacherDepartmentById } from '../reducer/AuthSlice';
import { getAllDept } from '../reducer/DeptSlice';
import { getAllSem, getAllSemByTeacherId } from '../reducer/SemSlice';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const TotalTeachers = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Total Teachers";
      }, []);
    const { dept } = useSelector((state) => state?.depts);
    const { sem, teachersem } = useSelector((state) => state?.sems);
    const { user, userlist, loading } = useSelector((state) => state.auth);
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
            email: user?.email || '',
        },
    });
    const {
        handleSubmit: handleDepartmentSubmit,
        register: registerDepartment,
        formState: { errors: departmentErrors },
    } = useForm();
    const {
        handleSubmit: handleSemesterSubmit,
        register: registerSemester,
        formState: { errors: semesterErrors },
    } = useForm();

    const [teacherSemesters, setTeacherSemesters] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTeacherId, setEditTeacherId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSemesterLoading, setSubmitSemesterLoading] = useState(false);
    const [submitDepartmentLoading, setSubmitDepartmentLoading] = useState(false);
    const [showUserFeedbackFirst, setShowUserFeedbackFirst] = useState(true);
    // const [associatedSemesters, setAssociatedSemesters] = useState([]);
    const [associatedDepartments, setAssociatedDepartments] = useState();

    const [profilePictures, setProfilePictures] = useState({});
    useEffect(() => {
        dispatch(allteacher());
        dispatch(getAllDept());
        dispatch(getAllSem());

    }, [dispatch]);
    useEffect(() => {
        dispatch(allteacher()).then(({ payload }) => {
            const teachers = payload?.body || [];
            teachers.forEach((teacher) => {
                dispatch(getPic({ id: teacher.id, gender: teacher?.gender })).then((result) => {
                    setProfilePictures((prev) => ({
                        ...prev,
                        [teacher.id]: result.payload,
                    }));
                });

                dispatch(getAllSemByTeacherId(teacher.id)).then((result) => {

                    setTeacherSemesters((prev) => ({
                        ...prev,
                        [teacher.id]: result?.payload || [],
                    }));
                });
            });
        });
    }, [dispatch]);


    useEffect(() => {
        if (user?.email) {
            setValue('email', user.email);
        }
    }, [user, setValue]);
    const OnlineBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            borderRadius: '50%',
            height: '12px',  // Adjust size as needed
            width: '12px',   // Adjust size as needed
            border: `2px solid ${theme.palette.background.paper}`,
            bottom: 7,       // Fine-tune positioning
            right: 3,        // Fine-tune positioning
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        },
    }));
    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            const userId = user?.id;
            const payload = { ...data, userId };
            if (editTeacherId) {
                const res = await dispatch(teacherupdateothers({ id: editTeacherId, userInput: payload }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Teacher updated successfully!' });
                }


                await dispatch(getAllSemByTeacherId(editTeacherId)).then((result) => {

                    setTeacherSemesters((prev) => ({
                        ...prev,
                        [editTeacherId]: result?.payload || [],
                    }));
                });
            }
            await dispatch(allteacher());
            reset();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
        } catch (error) {
            notification.error({ message: 'Failed to update teacher. Try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };
    const handleSemesterDelete = async (data) => {
        setSubmitSemesterLoading(true);
        try {
            const userId = user?.id;
            const payload = { semId: data.semId, userId };

            if (editTeacherId) {
                const res = await dispatch(deleteTeacherSemesterById({ id: editTeacherId, userInput: payload }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Semester deleted successfully!' });
                }

            }
            await setTeacherSemesters((prev) => {
                const updatedSemesters = (prev[editTeacherId] || []).filter(
                    (sem) => sem.id !== data.semId
                );


                return { ...prev, [editTeacherId]: updatedSemesters };
            });
            await dispatch(allteacher());
            reset();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
        } catch (error) {
            notification.error({ message: 'Failed to delete semester. Try again.' });
        } finally {
            setSubmitSemesterLoading(false);
        }
    };
    const handleDepartmentDelete = async (data) => {
        setSubmitDepartmentLoading(true);
        try {
            const userId = user?.id;
            const payload = {
                deptId: data.deptId, userId
            };
            if (editTeacherId) {
                const res = await dispatch(deleteTeacherDepartmentById({ id: editTeacherId, userInput: payload }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Department updated successfully!' });
                }

            }
            await dispatch(allteacher());
            reset();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
        } catch (error) {
            notification.error({ message: 'Failed to delete department. Try again.' });
        } finally {
            setSubmitDepartmentLoading(false);
        }
    };

    const sortedFeedbacks = showUserFeedbackFirst
        ? [
            ...((userlist || []).filter((userlist) => userlist.email === user?.email)),
            ...((userlist || []).filter((userlist) => userlist.email !== user?.email)),
        ]
        : userlist || [];

    const columns = [
        { field: 'id', headerName: 'S.No.', width: 80 },
        {
            field: 'profilePic',
            headerName: 'Profile Picture',
            width: 100,
            renderCell: (params) => (
                <>

                    <OnlineBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant={params?.row?.isonline ? 'dot' : 'standard'}
                    >
                        <img
                            src={profilePictures[params.row.id]}
                            alt="Profile"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        />
                    </OnlineBadge>
                </>
            )
        },
        { field: 'name', headerName: 'Name', sortable: true },
        // { field: 'isonline', headerName: 'Online', width: 50, renderCell: (params) => (params.value ? 'Yes' : 'No') },
        { field: 'role', headerName: 'Role', sortable: true },
        { field: 'gender', headerName: 'Gender', sortable: true },
        { field: 'email', headerName: 'Email ID', sortable: true, width: 200 },
        { field: 'emailVerified', headerName: 'Email Verified', sortable: true, renderCell: (params) => (params.value ? 'Yes' : 'No'), },
        { field: 'phone', headerName: 'Phone No', sortable: true,renderCell: (params) => (params.value ? params.value : 'Not Added') },
        { field: 'college', headerName: 'College', sortable: true, width: 230 },
        { field: 'deptname', headerName: 'Department', sortable: true, width: 200,renderCell: (params) => (params.value ? params.value : 'Not Assigned') },
        {
            field: 'sem',
            headerName: 'Semester',
            sortable: true,
            width: 200,
            renderCell: (params) => {


                const semesters = teacherSemesters[params.row.id] || [];
                return semesters.length > 0
                    ? semesters.map((s) => s.semname).join(', ')
                    : 'Not Assigned';
            },
        },
        { field: 'createdAt', headerName: 'Created At', sortable: true, },
        { field: 'modifiedAt', headerName: 'Updated At', sortable: true },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            renderCell: (params) => (
                <div>
                    {(user?.role === 'admin' || user?.role === 'pic') && (
                        <>
                            <IconButton onClick={() => handleEditClick(params.row)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </div>
            ),
        },
    ];



    const handleEditClick = (record) => {
        setEditTeacherId(record.id);
        dispatch(getAllSemByTeacherId(record.id));
        // const teacherSemesters = Array.isArray(record.sem) ? record.sem.map(s => s.id) : [];
        // setAssociatedSemesters(teacherSemesters);
        setValue('role',record.role)
        setValue('deptId',record.deptStaticId)
        setValue('semId',record.semStaticId)
        const teacherDepartments = record.deptname
        setAssociatedDepartments(teacherDepartments)
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this teacher?',
            onOk: async () => {
                try {
                    const userId = user?.id;
                    const payload = { userId };
                    const res = await dispatch(deleteTeacher({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Teacher deleted successfully!' });
                    }

                    await dispatch(allteacher());
                } catch (error) {
                    notification.error({ message: 'Failed to delete teacher.' });
                }
            },
        });
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
                Teachers Page
            </Typography>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                View our teachers.
            </Typography>

            <Box sx={{ marginTop: '30px' }}>
                <FormControlLabel
                    control={<Switch checked={showUserFeedbackFirst} onChange={() => setShowUserFeedbackFirst(!showUserFeedbackFirst)} />}
                    label="Show my name first"
                />
                <DataGrid
                    rows={sortedFeedbacks}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 15]}
                    disableSelectionOnClick
                    autoHeight
                />
            </Box>

            <Modal
                title={editTeacherId ? 'Edit Teacher' : 'Add Feedback'}
                open={isEditModalOpen || isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    reset();
                    setEditTeacherId(null);
                }}
                footer={null}
                centered
                width="80%"
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                        {editTeacherId ? 'Edit Teacher Details' : 'Add Feedback'}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {/* Role */}
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    value={watch('role')||''}
                                    // displayEmpty
                                    {...register("role", { required: true })}
                                    error={!!errors.role}
                                >
                                    <MenuItem value="" disabled>
                                        Select Role
                                    </MenuItem>
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                    <MenuItem value="hod">H.O.D.</MenuItem>
                                    <MenuItem value="pic">P.I.C.</MenuItem>
                                </Select>
                                {errors.role && (
                                    <Typography color="error" variant="caption">
                                        Role is required.
                                    </Typography>
                                )}
                            </Grid>

                            {/* Department */}
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    // defaultValue=""
                                    value={watch('deptId')||''}
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
                                    // defaultValue=""
                                    value={watch('semId')||''}
                                    // displayEmpty
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

                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
                                    {submitLoading ? <CircularProgress size={24} /> : 'Submit'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <form onSubmit={handleSemesterSubmit(handleSemesterDelete)}>


                        <Collapse style={{ marginBottom: '16px', marginTop: '16px' }}>
                            <Collapse.Panel header="Delete Semester Of That Teacher" >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Select
                                            fullWidth
                                            defaultValue=""
                                            displayEmpty
                                            {...registerSemester("semId", { required: true })}
                                            error={!!semesterErrors.semId}
                                        >
                                            <MenuItem value="" disabled>Select Semester</MenuItem>
                                            {teachersem.map((listsem) => (
                                                <MenuItem key={listsem.id} value={listsem.id}>{listsem.semname}</MenuItem>
                                            ))}
                                        </Select>
                                        {semesterErrors.semId && (
                                            <Typography color="error" variant="caption">Semester is required.</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={submitSemesterLoading}
                                        >
                                            {submitSemesterLoading ? <CircularProgress size={24} /> : 'Submit'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Collapse.Panel>
                        </Collapse>
                    </form>

                    <form onSubmit={handleDepartmentSubmit(handleDepartmentDelete)}>
                        <Collapse>
                            <Collapse.Panel header="Delete Department Of That Teacher">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Select
                                            fullWidth
                                            defaultValue=""
                                            displayEmpty
                                            {...registerDepartment("deptId", { required: true })}
                                            error={!!departmentErrors.deptId}
                                        >
                                            <MenuItem value="" disabled>Select Department</MenuItem>
                                            {dept?.body?.filter(d => d.deptname === associatedDepartments).map((listdept) => (
                                                <MenuItem key={listdept.id} value={listdept.id}>
                                                    {listdept.deptname}  {/* Make sure to use deptname here */}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {departmentErrors.deptId && (
                                            <Typography color="error" variant="caption">Department is required.</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={submitDepartmentLoading}
                                        >
                                            {submitDepartmentLoading ? <CircularProgress size={24} /> : 'Submit'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Collapse.Panel>
                        </Collapse>
                    </form>

                </Box>
            </Modal >
        </Box >
    );
};

export default TotalTeachers;
