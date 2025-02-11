import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,


    CircularProgress,

    Grid,
    TextField,

} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { notification, Modal, Spin, message } from 'antd';
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
import { addAssignmentUpload, assignmentUploadByAssignmentId, deleteAssignmentUploadById, downloadBlobPdf, downloadPdf, updateAssignmentUpload } from '../reducer/AssignmentUpload';
import Dragger from 'antd/es/upload/Dragger';
import { PDFDocument, rgb } from 'pdf-lib';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/webpack'; 
import PDFAnnotationComponent from '../components/PDFAnnotationComponent'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';

const AssignmentUpload = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Uploaded Assignments";
      }, []);
    const { user } = useSelector((state) => state.auth);
    const { assignmentUploads, assignmentAssignmentUploads, loading } = useSelector((state) => state.assignmentUpload);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditPdfModalOpen, setIsEditPdfModalOpen] = useState(false);
    const [editNotesId, setEditNotesId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [annotatedPdf, setAnnotatedPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {
        handleSubmit,
        register,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    // GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.version}/pdf.worker.min.js`;
    // pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    const { assignmentId } = useParams();
    const secretKey = 'virtualacademy';
    const decodedId = decodeURIComponent(assignmentId);

    // Decrypt the ID using the same secret key
    const originalId = CryptoJS.AES.decrypt(decodedId, secretKey).toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        dispatch(assignmentUploadByAssignmentId(originalId));
    }, [dispatch]);




    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {

            const studentId = user?.id;
            const payload = { ...data, assignmentId: originalId, studentId };
            const teacherId = user?.id
            const updatePayload = {
                ...data,
                assignmentId: originalId,
                teacherId,
                annotatedPdf: annotatedPdf || selectedPdf
            };
            if (editNotesId) {
                const res = await dispatch(updateAssignmentUpload({ id: editNotesId, userInput: updatePayload }))
                if (res?.payload?.statusCodeValue === 200) {
                    notification.success({ message: 'Assignment has been checked successfully!' });
                }

                setEditNotesId(null)
            } else {
                const res = await dispatch(addAssignmentUpload(payload))
                if (res?.payload?.statusCodeValue === 201) {
                    notification.success({ message: 'Assignment has been submitted successfully!' });
                }

            }
            reset();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
            await dispatch(assignmentUploadByAssignmentId(originalId));
        } catch (error) {
            notification.error({ message: 'Failed to add assignment. Try again.' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const [formData, setFormData] = useState({
        marks: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue(name, value); // Use react-hook-form's setValue to update form fields
    };

    const handleEditClick = async (record) => {
        setEditNotesId(record.id);
        // Use setValue to set the values in the form
        // setValue('marks', record.marks || '');  // Set value of marks
        // setValue('remarks', record.remarks || '');
        reset({
            marks: record.marks || '',
            remarks: record.remarks || ''
          });
        try {
            // Fetch the PDF as a Blob from the backend
            const pdfBlob = await dispatch(downloadBlobPdf(record.id)).unwrap(); // Get Blob from thunk
            if (pdfBlob instanceof Blob) {
                setSelectedPdf(pdfBlob);  // Store the Blob in the state (if needed)
                // await annotatePdf(pdfBlob);  // Pass the Blob directly to annotatePdf function
                setIsEditModalOpen(true);  // Open the modal for editing
            } else {
                console.error("Failed to retrieve a valid PDF Blob.");
            }
        } catch (error) {
            console.error("Error fetching or annotating PDF:", error);
        }
    };





    const handleDeleteClick = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this Assignment?',
            onOk: async () => {
                try {
                    const teacherId = user?.id
                    const payload = { teacherId }
                    const res = await dispatch(deleteAssignmentUploadById({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Assignment deleted successfully!' });
                    }

                    await dispatch(assignmentUploadByAssignmentId(originalId));
                } catch (error) {
                    notification.error({ message: 'Failed to delete Assignment.' });
                }
            },
        });
    };

    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [selectedSemId, setSelectedSemId] = useState('');
    const [selectedSubId, setSelectedSubId] = useState('');

    const filteredRows = assignmentAssignmentUploads?.length > 0 ? assignmentAssignmentUploads.filter(
        (row) =>
            (selectedDeptId ? row.deptname === selectedDeptId : true) &&
            (selectedSemId ? row.semname === selectedSemId : true) &&
            (selectedSubId ? row.subname === selectedSubId : true)
    ) : [];

    const columns = [
        { field: 'id', headerName: 'S.No.', width: 80, hide: true },

        { field: 'studentName', headerName: 'Student', width: 200 },
        { field: 'reg', headerName: 'Registration', width: 200 },
        { field: 'marks', headerName: 'Marks', width: 200 },
        { field: 'remarks', headerName: 'Remarks', width: 200,renderCell: (params) => (params.value ? params.value : 'Not Given') },
        { field: 'teachername', headerName: 'Teacher', width: 200 },
        { field: 'assignmentName', headerName: 'Assignment', width: 250 },
        { field: 'subjectname', headerName: 'Subject', width: 250 },
        { field: 'semname', headerName: 'Semester.', width: 150 },
        { field: 'deptname', headerName: 'Department', width: 200 },
        {
            field: 'submitedAt',
            headerName: 'Submited At',
            width: 200,
            renderCell: (params) =>
                dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
        },
        {
            field: 'checkedAt',
            headerName: 'Checked At',
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

    const handleSaveAnnotation = async (updatedPdfBlob) => {
        try {
            if (updatedPdfBlob instanceof Blob) {
                setAnnotatedPdf(updatedPdfBlob); // Store in state
                message.success('PDF annotations saved successfully.');
            } else {
                console.error('Expected a Blob, but received:', typeof updatedPdfBlob);
            }
        } catch (error) {
            console.error('Error saving PDF annotations:', error);
            message.error('Failed to save annotations.');
        }
    };


    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Uploaded Assignment Page
            </Typography>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                View uploaded assignment.
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
            <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
                {
                    user?.role === "student" ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Upload Assignment
                            </Button>
                        </>
                    ) : ''
                }

            </Grid>
            <Modal
                title={editNotesId ? 'Check Uploaded Assignment' : 'Submit Your Assignment'}
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        {...register('file', { required: editNotesId ? false : 'PDF file is required' })}
                                        disabled={editNotesId}
                                    />

                                    {errors.file && <p style={{ color: 'red' }}>{errors.file.message}</p>}
                                </Grid>
                            </Grid>



                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="number"
                                    label="Marks"
                                    variant="outlined"
                                    fullWidth
                                    inputProps={{ min: 0, max: 10 }}
                                    disabled={!editNotesId}
                                    {...register('marks', {
                                        required: !editNotesId ? false : 'Marks are required',
                                        min: { value: 0, message: 'Marks cannot be less than 0' },
                                        max: { value: 10, message: 'Marks cannot be more than 10' }
                                    })}

                                    error={!!errors.marks}
                                    helperText={errors?.marks?.message}
                                />
                            </Grid>



                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    variant="outlined"
                                    disabled={!editNotesId}
                                    {...register('remarks', { required: !editNotesId ? false : 'remarks is required' })}
                                    error={!!errors.remarks}
                                    helperText={errors?.remarks?.message}
                                />
                                {/* {errors?.remarks && <p style={{ color: 'red' }}>{errors?.remarks?.message}</p>} */}
                            </Grid>
                            {(user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') &&
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ height: '50px' }}
                                        onClick={() => setIsEditPdfModalOpen(true)} 
                                    >
                                        Check PDF
                                    </Button>
                                </Grid>
                            }



                            {
                                (user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic' || user?.role === 'student') ? (
                                    <>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                sx={{ height: '50px' }}
                                            >
                                                {submitLoading ? <CircularProgress color="inherit" size="30px" /> : editNotesId ? 'Check Assignment' : 'Submit Assignment'}
                                            </Button>
                                        </Grid>
                                    </>
                                ) : ''
                            }

                        </Grid>
                    </form>
                </Box>
            </Modal >
            <Modal
                title="Annotate and Edit Assignment"
                open={isEditPdfModalOpen}
                onCancel={() => {
                    setIsEditPdfModalOpen(false);
                    // reset();
                }}
                footer={null}
                width="100%"
                centered
                
            >

                {selectedPdf && (
                    <PDFAnnotationComponent
                        pdfData={selectedPdf} // This passes the updated annotated PDF
                        onSave={handleSaveAnnotation}// Ensure onSave is correctly passed
                    />
                )}

            </Modal>


        </Box >
    );
};

export default AssignmentUpload;
