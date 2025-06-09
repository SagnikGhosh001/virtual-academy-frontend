import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { message, Modal, notification, Spin } from 'antd';
import { Card, Typography, TextField, Box, Grid, CircularProgress, IconButton, Button } from '@mui/material';
import { Edit, Delete, Mail, Visibility } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { addInbox, deleteInboxById, getInbox, getInboxByStudentid, inboxByTeacherId, isread, updateInbox } from '../reducer/InboxSlice';
import dayjs from 'dayjs';

const Inbox = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Inbox";
      }, []);
    const dispatch = useDispatch();
    const { inboxes, studentInboxes, teacherInboxes, loading } = useSelector((state) => state.inbox);
    const { user } = useSelector((state) => state?.auth);
    const userRole = user?.role;
    const userId = user?.id;

    const [selectedInbox, setSelectedInbox] = useState(null);
    const { handleSubmit, control, reset,watch } = useForm({
        defaultValues: {
            email: '',
            msg: '',
        },
    });

    useEffect(() => {
        if (selectedInbox) {
            reset({
                msg: selectedInbox.msg,
                email: selectedInbox.studentEmail || '',  // Set email only if needed
            });
        } else {
            reset({
                msg: '',
                email: '',
            });
        }
    }, [selectedInbox, reset]);
    
    useEffect(() => {
        if (userRole === 'student') {
            dispatch(getInboxByStudentid(userId))
        } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'pic') {
            dispatch(inboxByTeacherId(userId))
        } else if (userRole === 'admin') {
            dispatch(getInbox())
        }
    }, [dispatch]);

    const handleAddInbox = async (data) => {
        try {
            if (!data.email || !userId || !data.msg) {
                message.warning('Please fill out all fields');
                return;
            }
            const res = await dispatch(addInbox({ ...data, teacherId: userId }));
            if (res?.payload?.statusCodeValue === 200) {
                reset();
                message.success('Message send successfully!');
            }
            if (userRole === 'student') {
                await dispatch(getInboxByStudentid(userId))
            } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'pic') {
                await dispatch(inboxByTeacherId(userId))
            }
        } catch (error) {
            message.error('Failed to add inbox.');
        }
    };
    const handleRead = async (feedbackid) => {
        try {
            const payload = { currentId: userId }
            const res = await dispatch(isread({ id: feedbackid, userInput: payload }));
            if (res?.payload?.statusCodeValue === 200) {
                message.success('Message readed successfully!');
                if (userRole === 'student') {

                    await dispatch(getInboxByStudentid(userId))
                } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'pic') {
                    await dispatch(inboxByTeacherId(userId))
                }
            }
        } catch (error) {
            message.error('Failed to send message.');
        }
    };

    const handleUpdateInbox = async (data) => {
        if (selectedInbox) {
            const payload = { ...data, teacherId: userId }
            const res = await dispatch(updateInbox({ id: selectedInbox.id, userInput: payload }));
            if (res?.payload?.statusCodeValue === 200) {
                message.success('Message updated successfully!');
            }
            if (userRole === 'student') {
                await dispatch(getInboxByStudentid(userId))
            } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'pic') {
                await dispatch(inboxByTeacherId(userId))
            }
            setSelectedInbox(null);
            reset();
        } else {
            message.warning('Nothing selected for update');
        }
    };

    const handleDeleteInbox = async (feedbackid) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this message?',
            onOk: async () => {
                try {
                    const payload = { teacherId: userId }
                    const res = await dispatch(deleteInboxById({ id: feedbackid, userInput: payload }));
                    if (res?.payload?.statusCodeValue === 200) {
                        message.success('Message deleted successfully!');
                    }
                    if (userRole === 'student') {
                        await dispatch(getInboxByStudentid(userId))
                    } else if (userRole === 'teacher' || userRole === 'hod' || userRole === 'pic') {
                        await dispatch(inboxByTeacherId(userId))
                    }
                } catch (error) {
                    notification.error({ message: 'Failed to delete message.' });
                }
            },
        });





    };

    const teacherColumns = [
        { field: 'serialNo', headerName: 'ID', width: 100 ,renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1  },
        { field: 'studentName', headerName: 'Student Name', width: 250 },
        { field: 'studentEmail', headerName: 'Student Email', width: 250 },
        { field: 'studentReg', headerName: 'Student Reg', width: 250 },
        { field: 'studentSem', headerName: 'Student Sem', width: 250 },
        { field: 'studentDept', headerName: 'Student Department', width: 250 },
        { field: 'msg', headerName: 'Message', width: 400 },
        { field: 'read', headerName: 'Seen', width: 100, renderCell: (params) => (params.value ? 'Yes' : 'No') },

        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
        },
        {
            field: 'modifiedAt',
            headerName: 'Updated At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'Never Updated',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => setSelectedInbox(params.row)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteInbox(params.row.id)} color="error">
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }
    const studentColumns = [
        { field: 'serialNo', headerName: 'ID', width: 100,renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1   },
        { field: 'teacherName', headerName: 'Teacher Name', width: 250 },
        { field: 'teacherDept', headerName: 'Teacher Department', width: 250 },
        { field: 'msg', headerName: 'Message', width: 400 },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
        },
        {
            field: 'modifiedAt',
            headerName: 'Updated At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'Never Updated',
        },
        {
            field: 'read',
            headerName: 'Seen',
            width: 150,
            renderCell: (params) => (
                <>
                    {
                        !params.value &&
                        <IconButton onClick={() => handleRead(params.row.id)} color="primary">
                            <Visibility />
                        </IconButton>
                    }

                </>
            ),
        },
    ];
    const adminColumns = [
        { field: 'serialNo', headerName: 'ID', width: 100 ,renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1  },
        { field: 'teacherName', headerName: 'Teacher Name', width: 250 },
        { field: 'teacherDept', headerName: 'Teacher Department', width: 250 },
        { field: 'studentName', headerName: 'Student Name', width: 250 },
        { field: 'studentEmail', headerName: 'Student Email', width: 250 },
        { field: 'studentReg', headerName: 'Student Reg', width: 250 },
        { field: 'studentSem', headerName: 'Student Sem', width: 250 },
        { field: 'studentDept', headerName: 'Student Department', width: 250 },
        { field: 'read', headerName: 'Seen', width: 100, renderCell: (params) => (params.value ? 'Yes' : 'No') },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
        },
        {
            field: 'modifiedAt',
            headerName: 'Updated At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'Never Updated',
        },

    ];

    // const columns = userRole === ('teacher' || 'hod' || 'pic') ? teacherColumns : studentColumns;
    // const rows = userRole === ('teacher' || 'hod' || 'pic')
    //     ? teacherInboxes
    //     : studentInboxes;
    const columns = userRole === 'admin'
        ? adminColumns
        : userRole === 'teacher' || userRole === 'hod' || userRole === 'pic'
            ? teacherColumns
            : studentColumns;

    const rows = userRole === 'admin'
        ? inboxes
        : userRole === 'teacher' || userRole === 'hod' || userRole === 'pic'
            ? teacherInboxes
            : studentInboxes;


    return (

        <Card>

            <Typography variant="h4" gutterBottom sx={{ padding: '20px' }}>
                {userRole === 'admin'
                    ? 'Admin Inbox Management'
                    : (userRole === 'teacher' || userRole === 'hod' || userRole === 'pic')
                        ? 'Teacher Inbox Management'
                        : 'Student Inbox'}

            </Typography>

            {(userRole === 'teacher' || userRole === 'hod' || userRole === 'pic') && (
                <form onSubmit={handleSubmit(selectedInbox ? handleUpdateInbox : handleAddInbox)}>
                    <Box sx={{ mb: 4, marginLeft: '20px', marginRight: '20px' }}>
                        <Grid container spacing={2}>
                            {!selectedInbox &&
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} label="Student Email" fullWidth />
                                        )}
                                    />
                                </Grid>
                            }
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="msg"
                                    control={control}
                                    // value={watch('msg')||''}
                                    // render={({ field }) => (
                                    //     <TextField {...field} label="Message" fullWidth />
                                    // )}
                                    render={({ field }) => (
                                        <TextField {...field} label="Message" fullWidth />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary">
                                {selectedInbox ? 'Update' : 'Send'}
                            </Button>
                            {selectedInbox && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setSelectedInbox(null);
                                        reset();
                                    }}
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            )}


            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 15, 20]}
                    disableSelectionOnClick
                />
            </Box>

        </Card>
    );
};

export default Inbox;
