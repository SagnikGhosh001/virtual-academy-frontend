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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { notification, Modal, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { allstudents, blockedStudent, deleteStudent, getPic, studentupdateothers } from '../reducer/AuthSlice';
import { getAllDept } from '../reducer/DeptSlice';
import { getAllSem } from '../reducer/SemSlice';
import BlockIcon from '@mui/icons-material/Block';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const TotalStudents = () => {
  useEffect(() => {
      document.title = "Virtual Academy | Total Students";
    }, []);
  const { user, userlist, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { dept } = useSelector((state) => state?.depts);
  const { sem } = useSelector((state) => state?.sems);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showUserFeedbackFirst, setShowUserFeedbackFirst] = useState(true);
  const [profilePictures, setProfilePictures] = useState({});

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  }  = useForm({
    defaultValues: {
      reg: '',         // Default empty string or predefined values
      role: 'student', // Set default role as 'student'
      deptId: '',      // Default to empty or initial department ID
      semId: '',       // Default to empty or initial semester ID
    },
  });

  useEffect(() => {
    dispatch(allstudents());
    dispatch(getAllDept());
    dispatch(getAllSem());
  }, [dispatch]);
  useEffect(() => {
    dispatch(allstudents()).then(({ payload }) => {
      const students = payload?.body || []; // Adjust according to the actual structure
      students.forEach((student) => {
        dispatch(getPic({ id: student.id, gender: student?.gender })).then((result) => {

          setProfilePictures((prev) => ({
            ...prev,
            [student.id]: result.payload,
          }));
        });
      });
    });
    // dispatch(getAllDept());
    // dispatch(getAllSem());
  }, [dispatch]);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const userId = user?.id;
      const payload = { ...data, userId };
      if (editStudentId) {
        const res = await dispatch(studentupdateothers({ id: editStudentId, userInput: payload }))
        if (res?.payload?.statusCodeValue === 200) {
          notification.success({ message: 'Student updated successfully!' });
        }

      }
      reset();
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      await dispatch(allstudents());
    } catch (error) {
      notification.error({ message: 'Failed to update student. Try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const sortedFeedbacks = showUserFeedbackFirst
    ? [
      ...(userlist?.filter((student) => student.email === user?.email) || []),
      ...(userlist?.filter((student) => student.email !== user?.email) || []),
    ]
    : userlist || [];

  const handleEditClick = (record) => {
    setEditStudentId(record.id);
    setValue('reg', record.reg );  
    setValue('semId', record.semStaticId || ''); 
    setValue('deptId', record.deptStaticId || ''); 
    setValue('role', record.role || 'student');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this student?',
      onOk: async () => {
        try {
          const userId = user?.id
          const payload = { userId }
          const res = await dispatch(deleteStudent({ id: id, userInput: payload }))

          if (res?.payload?.statusCodeValue === 200) {
            notification.success({ message: 'Student deleted successfully!' });
          }

          await dispatch(allstudents());
        } catch (error) {
          notification.error({ message: 'Failed to delete student.' });
        }
      },
    });
  };
  const handleBlockedClick = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to blocked this student?',
      onOk: async () => {
        try {
          const currentUserId = user?.id
          const payload = { currentUserId }
          const res=await dispatch(blockedStudent({ id: id, userInput: payload }))
          if (res?.payload?.statusCodeValue === 200) {
            notification.success({ message: 'Student Blocked successfully!' });
          }
          
          dispatch(allstudents());
        } catch (error) {
          notification.error({ message: 'Failed to Blocked student.' });
        }
      },
    });
  };
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
  const columns = [
    { field: 'id', headerName: 'S.No.', width: 80, hide: true },
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
              src={profilePictures[params.row.id] || 'https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg'}
              alt="Profile"
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
          </OnlineBadge>
        </>
      )
    },
    { field: 'name', headerName: 'Name', width: 200 },
    // { field: 'isonline', headerName: 'Online', width: 50, renderCell: (params) => (params.value ? 'Yes' : 'No') },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'email', headerName: 'Email ID', width: 250 },
    {
      field: 'emailVerified',
      headerName: 'Email Verified',
      width: 150,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    { field: 'isblocked', headerName: 'Status', width: 100, renderCell: (params) => (params.value ? 'Blocked' : 'Unblocked') },
    { field: 'blockedby', headerName: 'Blocked By', width: 200, renderCell: (params) => (params.value ? params.value : 'Unblocked') },
    { field: 'phone', headerName: 'Phone No.', width: 150 },
    { field: 'college', headerName: 'College', width: 200 },
    { field: 'semname', headerName: 'Semester', width: 150 },
    { field: 'deptname', headerName: 'Department', width: 200 },
    { field: 'reg', headerName: 'Registration No.', width: 180 },
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
          {
            (user?.role === "admin" || user?.role==='pic' || user?.role==='hod') ? (
              <>
                <IconButton onClick={() => handleEditClick(params.row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleBlockedClick(params.row.id)} color="error">
                  <BlockIcon />
                </IconButton>
              </>
            ) : "NA"
          }

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
        Student Page
      </Typography>
      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        View our students.
      </Typography>

      <Box sx={{ marginTop: '30px' }}>
        <FormControlLabel
          control={<Switch checked={showUserFeedbackFirst} onChange={() => setShowUserFeedbackFirst(!showUserFeedbackFirst)} />}
          label="Show my name first"
        />
        <Box sx={{ height: 600, marginTop: '20px' }}>
          <DataGrid
            rows={sortedFeedbacks}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            autoHeight
          />
        </Box>
      </Box>

      <Modal
        title={editStudentId ? 'Edit Student Details' : 'Add New Student'}
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
                  label="Registration No"
                  variant="outlined"
                  {...register('reg', { required: true })}
                  error={!!errors.reg}
                  helperText={errors.reg && 'Registration No is required.'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={watch('role') || ''} 
                  {...register('role', { required: true })}
                  error={!!errors.role}
                >
                  <MenuItem value="" disabled>
                    Select Role
                  </MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
                {errors.role && (
                  <Typography color="error" variant="caption">
                    Role is required.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={watch('deptId') || ''} 
                  {...register('deptId', { required: true })}
                  error={!!errors.deptId}
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
                {errors.deptId && (
                  <Typography color="error" variant="caption">
                    Department is required.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={watch('semId') || ''} 
                  {...register('semId', { required: true })}
                  error={!!errors.semId}
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
                {errors.semId && (
                  <Typography color="error" variant="caption">
                    Semester is required.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '50px' }}
                >
                  {submitLoading ? <CircularProgress color="inherit" size="30px" /> : editStudentId ? 'Update Student' : 'Add Student'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default TotalStudents;
