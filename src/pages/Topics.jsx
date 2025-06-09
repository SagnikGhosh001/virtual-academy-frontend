import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    FormControlLabel,
    Switch,
    CircularProgress,
    Select,
    MenuItem,
    TextField,
    Grid,
    FormControl,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { notification, Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { InboxOutlined } from '@ant-design/icons';
import DownloadIcon from '@mui/icons-material/Download';
import { getAllSub } from '../reducer/SubSlice';
import { getAllSem } from '../reducer/SemSlice';
import { getAllDept } from '../reducer/DeptSlice';
import CryptoJS from 'crypto-js';
import { useParams } from 'react-router-dom';
import { addtopic, deleteTopicbyId, downloadPdf, topicbySubId, updatetopic, uploadPdf } from '../reducer/TopicSlice';

const Topics = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Topics";
    }, []);
    const { user } = useSelector((state) => state.auth);
    // const { notes, subnotes, loading } = useSelector((state) => state.notes);
    const { topic, subtopics, loading } = useSelector((state) => state.topic);
    const dispatch = useDispatch();
    const { subs } = useSelector((state) => state?.subs);
    const { dept } = useSelector((state) => state?.depts);
    const { sem } = useSelector((state) => state?.sems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editNotesId, setEditNotesId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showUserFeedbackFirst, setShowUserFeedbackFirst] = useState(true);

    const {
        handleSubmit,
        register,
        reset,
        setValue,
        formState: { errors },
    } = useForm();


    const { subjectId } = useParams();
    const secretKey = 'virtualacademy';
    const decodedId = decodeURIComponent(subjectId);

    // Decrypt the ID using the same secret key
    const originalId = CryptoJS.AES.decrypt(decodedId, secretKey).toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        dispatch(topicbySubId(originalId));
        dispatch(getAllSub());
        dispatch(getAllSem())
        dispatch(getAllDept())
    }, [dispatch]);
    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            const teacherId = user?.id;
            const payload = { ...data, subId: originalId, teacherId };
            if (editNotesId) {
                const res = await dispatch(updatetopic({ id: editNotesId, userInput: payload }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Topic wise notes updated successfully!' });
                }

                setEditNotesId(null)
            } else {
                const res = await dispatch(addtopic(payload))
                if (res?.payload?.statusCodeValue === 201) {
                    notification.success({ message: 'Topic wise notes submitted successfully!' });
                }

            }
            reset();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
            await dispatch(topicbySubId(originalId));
        } catch (error) {
            notification.error({ message: 'Failed to add topic wise note. Try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditClick = (record) => {
        setEditNotesId(record.id);
        setValue('name', record.name);
        setValue('link', record.link);
        setIsEditModalOpen(true);
    };


    const handleFileUpload = async (event, id) => {
        const file = event.target.files[0];
        if (!file) return;

        const role = user?.role;
        const payload = { id, role, file };

        try {
            await dispatch(uploadPdf(payload)).unwrap();
            notification.success({ message: 'PDF uploaded successfully!' });
            await dispatch(topicbySubId(originalId)); // Refresh notes after upload
        } catch (error) {
            notification.error({ message: 'Failed to upload PDF.' });
        }
    };


    const handleDeleteClick = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this topic wise note?',
            onOk: async () => {
                try {
                    const teacherId = user?.id
                    const payload = { teacherId }
                    const res = await dispatch(deleteTopicbyId({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Topic wise note deleted successfully!' });
                    }

                    await dispatch(topicbySubId(originalId));
                } catch (error) {
                    notification.error({ message: 'Failed to delete Topic wise note.' });
                }
            },
        });
    };

    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [selectedSemId, setSelectedSemId] = useState('');
    const [selectedSubId, setSelectedSubId] = useState('');

    const filteredRows = subtopics?.length > 0 ? subtopics.filter(
        (row) =>
            (selectedDeptId ? row.deptname === selectedDeptId : true) &&
            (selectedSemId ? row.semname === selectedSemId : true) &&
            (selectedSubId ? row.subname === selectedSubId : true)
    ) : [];
    const handleDeptChange = (event) => {
        setSelectedDeptId(event.target.value);
    };

    const handleSemChange = (event) => {
        setSelectedSemId(event.target.value);
    };
    const handleSubChange = (event) => {
        setSelectedSubId(event.target.value);
    };
    const columns = [
        { field: 'serialNo', headerName: 'S.No.', width: 80, hide: true, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'link', headerName: 'Link', width: 200,
            renderCell: (params) => (
                params.value ?
                    <a
                        href={params.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}
                    >
                        Open Link
                    </a> : 'Not Provided'
            )
        },
        {
            field: 'upload',
            headerName: 'Upload',
            width: 150,
            renderCell: (params) => (
                <div>
                    {(user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') ?
                        (<IconButton>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileUpload(e, params.row.id)}
                                style={{ display: 'none' }}
                                id={`upload-pdf-${params.row.id}`}
                            />
                            <label htmlFor={`upload-pdf-${params.row.id}`}>
                                < InboxOutlined />
                            </label>
                        </IconButton>) : null
                    }
                </div>
            ),
        },
        { field: 'subname', headerName: 'Subject', width: 250 },
        { field: 'semname', headerName: 'Semester.', width: 150 },
        { field: 'deptname', headerName: 'Department', width: 200 },
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
                <div>
                    {(user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') ? (
                        <>
                            <IconButton onClick={() => handleEditClick(params.row)}>
                                <EditIcon />
                            </IconButton>
                            {params.row?.pdf ?
                                < IconButton >
                                    <DownloadIcon onClick={() => dispatch(downloadPdf(params.row.id))} />
                                </IconButton> : ''}
                            <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </>
                    ) : (
                        < IconButton >
                            <DownloadIcon onClick={() => dispatch(downloadPdf(params.row.id))} />
                        </IconButton>
                    )}
                </div >
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
    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container alignItems="center" spacing={2} sx={{ mb: 3 }}>
                {/* Left spacer */}
                <Grid item xs={false} sm={2} md={3} />
                <Grid item xs={12} sm={8} md={6}>
                    <Typography variant="h4" textAlign="center" gutterBottom>
                        Topic Wise Notes
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
                        mt: { xs: 0, sm: 0, }
                    }}
                >
                    {
                        (user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setIsModalOpen(true)}

                                >
                                    Add Note
                                </Button>
                            </>
                        ) : ''
                    }
                </Grid>
            </Grid>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                View our uploaded Topic Wise Notes.
            </Typography>
            {/* {
                <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                    <Grid item xs={12} sm={4}>
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

                    <Grid item xs={12} sm={4}>
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


                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <Select value={selectedSubId} onChange={handleSubChange} displayEmpty>
                                <MenuItem value="">
                                    <em>Select Subject</em>
                                </MenuItem>
                                {subs?.map((subject) => (
                                    <MenuItem key={subject.id} value={subject.subname}>
                                        {subject.subname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            } */}
            <Box sx={{ marginTop: '30px' }}>
                <Box sx={{ height: 600, marginTop: '20px' }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                        autoHeight
                    />
                </Box>
            </Box>

            <Modal
                title={editNotesId ? 'Edit Topic Wise Note Details' : 'Add New Topic Wise Note'}
                open={isEditModalOpen || isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    reset();
                    setEditNotesId(null);
                }}
                footer={null}
                width="80%"
                centered
            >
                <Box sx={{ padding: '20px' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    variant="outlined"
                                    {...register('name', { required: 'name is required' })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Link"
                                    variant="outlined"
                                    {...register('link')}
                                    error={!!errors.link}
                                    helperText={errors.link}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    defaultValue=""
                                    displayEmpty
                                    {...register('subId', { required: !editNotesId })}
                                    error={!!errors.subId}
                                    disabled={editNotesId}
                                >
                                    <MenuItem value="" disabled>
                                        Select Subject
                                    </MenuItem>
                                    {subs?.map((listsub) => (
                                        <MenuItem key={listsub.id} value={listsub.id}>
                                            {listsub.subname}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.subId && (
                                    <Typography color="error" variant="caption">
                                        Subject is required.
                                    </Typography>
                                )}
                            </Grid> */}
                            {
                                (user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') ? (
                                    <>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                sx={{ height: '50px' }}
                                            >
                                                {submitLoading ? <CircularProgress color="inherit" size="30px" /> : editNotesId ? 'Update Note' : 'Add Note'}
                                            </Button>
                                        </Grid>
                                    </>
                                ) : ''
                            }

                        </Grid>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
};

export default Topics;
