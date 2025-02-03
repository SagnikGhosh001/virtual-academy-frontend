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
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { notification, Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { allstudents, blockedStudent, deleteStudent, getPic, studentupdateothers } from '../reducer/AuthSlice';
import { getAllSub } from '../reducer/SubSlice';
import { getAllSem } from '../reducer/SemSlice';
import BlockIcon from '@mui/icons-material/Block';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { addmarks, deletemarks, getallMarks, updatemarks } from '../reducer/MarksSlice';

const Marks = () => {
  useEffect(() => {
      document.title = "Virtual Academy | Marks";
    }, []);
  const { user, userlist } = useSelector((state) => state.auth);
  const { marks, loading } = useSelector((state) => state.mark);
  const dispatch = useDispatch();
  const { subs } = useSelector((state) => state?.subs);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showUserFeedbackFirst, setShowUserFeedbackFirst] = useState(true);
  const [searchEmail, setSearchEmail] = useState(''); // Search state

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({

  });

  useEffect(() => {
    dispatch(allstudents());
    dispatch(getallMarks());
    dispatch(getAllSub())
    console.log(subs);

  }, [dispatch]);


  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const teacher = user?.id;
      const payload = { ...data, teacher };
      if (editStudentId) {
        const res = await dispatch(updatemarks({ id: editStudentId, userInput: payload }))
        if (res?.payload?.statusCodeValue === 200) {
          notification.success({ message: 'Marks updated successfully!' });
        }
      } else {
        const res = await dispatch(addmarks(payload))
        if (res?.payload?.statusCodeValue === 201) {
          notification.success({ message: 'Marks added successfully!' });
        }
      }
      reset();
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      await dispatch(getallMarks());
    } catch (error) {
      notification.error({ message: 'Failed to update student. Try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const sortedFeedbacks = showUserFeedbackFirst
    ? [
      ...(marks?.filter((mark) => mark.email === user?.email) || []),
      ...(marks?.filter((mark) => mark.email !== user?.email) || []),
    ]
    : marks || [];

  // Filter users based on email search
  const filteredStudents = sortedFeedbacks.filter((student) =>
    student.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const handleEditClick = (record) => {
    setEditStudentId(record.id);
    setValue('studentId', record.staticStudentId);
    setValue('subId', record.staticSubId);
    setValue('mark', record.mark);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this marks?',
      onOk: async () => {
        try {
          const teacher = user?.id
          const payload = { teacher }
          const res = await dispatch(deletemarks({ id: id, userInput: payload }))
          if (res?.payload?.statusCodeValue === 200) {
            notification.success({ message: 'Mark deleted successfully!' });
          }
          await dispatch(getallMarks());
        } catch (error) {
          notification.error({ message: 'Failed to delete mark.' });
        }
      },
    });
  };


  const columns = [
    { field: 'id', headerName: 'S.No.', width: 80, hide: true },
    { field: 'email', headerName: 'Email ID', width: 250 },
    { field: 'semname', headerName: 'Semester', width: 150 },
    { field: 'deptName', headerName: 'Department', width: 200 },
    { field: 'subname', headerName: 'Subject', width: 200 },
    { field: 'regNo', headerName: 'Registration No.', width: 180 },
    { field: 'mark', headerName: 'Marks', width: 180 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      renderCell: (params) => dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
    },
    {
      field: 'modifiedAt',
      headerName: 'Updated At',
      width: 200,
      renderCell: (params) => dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'Never Updated',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          {(user?.role === "teacher" || user?.role === 'pic' || user?.role === 'hod') ? (
            <>
              <IconButton onClick={() => handleEditClick(params.row)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </>
          ) : "NA"}
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

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Marks Page
      </Typography>
      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        View Marks.
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search by Email"
        variant="outlined"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              🔍
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: '20px' }}
      />

      <Box sx={{ marginTop: '30px' }}>
        <FormControlLabel
          control={<Switch checked={showUserFeedbackFirst} onChange={() => setShowUserFeedbackFirst(!showUserFeedbackFirst)} />}
          label="Show my name first"
        />
        <Box sx={{ height: 600, marginTop: '20px' }}>
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            autoHeight
          />
        </Box>
        <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
          {
            (user?.role === "teacher" || user?.role === "hod" || user?.role === "pic") ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Maks
                </Button>
              </>
            ) : ''
          }

        </Grid>
      </Box>

      <Modal
        title={editStudentId ? 'Edit Marks Details' : 'Add Marks of Student'}
        open={isEditModalOpen || isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditModalOpen(false);
          reset();
          setEditStudentId(null);
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
                  select
                  label="Select Student"
                  value={watch('studentId') || ''}
                  disabled={isEditModalOpen}
                  {...register('studentId', { required: true })}
                  error={!!errors.deptId}
                >
                  <MenuItem value="" disabled>
                    Select Student
                  </MenuItem>
                  {userlist?.map((list) => (
                    <MenuItem key={list.id} value={list.id}>
                      {list.email}
                    </MenuItem>
                  ))}
                </TextField>
                {errors.studentId && (
                  <Typography color="error" variant="caption">
                    Student email is required.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Select Subject"
                  value={watch('subId') || ''}
                  {...register('subId', { required: true })}
                  error={!!errors.subId}
                >
                  <MenuItem value="" disabled>
                    Select Subject
                  </MenuItem>
                  {subs?.map((list) => (
                    <MenuItem key={list.id} value={list.id}>
                      {list.subname}
                    </MenuItem>
                  ))}
                </TextField>
                {errors.subId && (
                  <Typography color="error" variant="caption">
                    Subject is required.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Mark"
                  variant="outlined"
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                  {...register('mark', {
                    required: 'Mark is required',
                    min: {
                      value: 0,
                      message: 'Mark cannot be less than 0',
                    },
                    max: {
                      value: 100,
                      message: 'Mark cannot be greater than 100',
                    },
                  })}

                  error={!!errors.mark}
                  helperText={errors?.mark?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '50px' }}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Processing...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Marks;
