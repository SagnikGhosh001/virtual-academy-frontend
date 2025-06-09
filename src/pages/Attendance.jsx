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
// import { addnotes, deleteNotes, downloadPdf, notesbySubId, updatenotes } from '../reducer/NotesSlice';
import DownloadIcon from '@mui/icons-material/Download';
import CryptoJS from 'crypto-js';
import { useParams } from 'react-router-dom';
import { addattendence, deleteattendencebyId, downloadPdf, getallattendence, getattendencebysubid, updateattendence, uploadPdf } from '../reducer/AttendanceSlice';

const Attendance = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Attendance";
    }, []);
    const { user } = useSelector((state) => state.auth);
    const { attendance, subattendance, loading } = useSelector((state) => state.attendance);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAttendanceId, setEditAttendanceId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);


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
        dispatch(getattendencebysubid(originalId));
        // dispatch(getallattendence());
    }, [dispatch]);
    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            const userid = user?.id;
            const payload = { ...data, subId: originalId, teacherId: userid };
            if (editAttendanceId) {
                const res = await dispatch(updateattendence({ id: editAttendanceId, userInput: payload }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Attendance updated successfully!' });
                }

                setEditAttendanceId(null)
            } else {
                const res = await dispatch(addattendence(payload))
                if (res?.payload?.statusCodeValue === 201) {
                    notification.success({ message: 'Attendance submitted successfully!' });
                }

            }
            reset();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
            await dispatch(getattendencebysubid(originalId));
        } catch (error) {
            notification.error({ message: 'Failed to add Attendance. Try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditClick = (record) => {
        setEditAttendanceId(record.id);
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
            const res = await dispatch(uploadPdf(payload))
            // console.log(res);

            // if (res?.payload?.statusCodeValue === 200) {
            notification.success({ message: 'PDF uploaded successfully!' });
            // }

            await dispatch(getattendencebysubid(originalId));
        } catch (error) {
            notification.error({ message: 'Failed to upload PDF.' });
        }
    };


    const handleDeleteClick = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this attendance?',
            onOk: async () => {
                try {
                    const teacherId = user?.id
                    const payload = { teacherId }
                    const res = await dispatch(deleteattendencebyId({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Attendance deleted successfully!' });
                    }

                    await dispatch(getattendencebysubid(originalId));
                } catch (error) {
                    notification.error({ message: 'Error to delete Attedance.' });
                }
            },
        });
    };

    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [selectedSemId, setSelectedSemId] = useState('');
    const [selectedSubId, setSelectedSubId] = useState('');

    const filteredRows = subattendance?.length > 0 ? subattendance.filter(
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
        { field: 'teachername', headerName: 'Teacher', width: 200 },
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
                                </IconButton> : ''
                            }

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
                    <Typography variant="h4" textAlign="center" gutterBottom >
                        Attedance
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
                    {
                        (user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') && subattendance.length === 0 ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setIsModalOpen(true)}

                                >
                                    Add Attendance
                                </Button>
                            </>
                        ) : ''
                    }
                </Grid>
            </Grid>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                View Attendance.
            </Typography>

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
                title={editAttendanceId ? 'Edit Attendance Details' : 'Add New Attendance'}
                open={isEditModalOpen || isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    reset();
                    setEditAttendanceId(null);
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
                                                {submitLoading ? <CircularProgress color="inherit" size="30px" /> : editAttendanceId ? 'Update Attendance' : 'Add Attendance'}
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

export default Attendance;
