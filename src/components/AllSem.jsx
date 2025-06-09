import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adddept, deletedept, getAllDept, getAllDeptbysemid } from '../reducer/DeptSlice';
import { Grid, Card, CardContent, Typography, CardActions, Button, Box, TextField, MenuItem, ListItemText, ListItem, ListItemIcon, Divider, List, Stack } from '@mui/material';
import { Add, BusinessOutlined, Delete, Edit, School } from '@mui/icons-material';
import { Modal, notification, Spin } from 'antd';
import { addsem, deletesem, getAllSem, updateSem } from '../reducer/SemSlice';
import { useForm } from 'react-hook-form';

const AllSem = () => {
  useEffect(() => {
    document.title = "Virtual Academy | Semester";
  }, []);
  const { user } = useSelector((state) => state.auth);
  const { sem, loading } = useSelector((state) => state?.sems);
  const [semDepartments, setSemDepartments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSem, setSelectedSem] = useState({ id: null, semname: '' });
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
    dispatch(getAllSem()).then((action) => {
      const semList = action.payload?.body || [];
      semList.forEach((semester) => {
        dispatch(getAllDeptbysemid(semester.id)).then((deptAction) => {
          setSemDepartments((prev) => ({ ...prev, [semester.id]: deptAction.payload.body }));
        });
      });
    });
  }, [dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormSubmit = async (data) => {
    const semData = {
      semname: data.semname,
      userid: user?.id
    };
    const res = await dispatch(addsem(semData));
    if (res?.payload?.statusCodeValue === 200) {
      notification.success({ message: 'Semester Added Sucessfully' })
    }

    await dispatch(getAllSem())
    handleCloseModal();
    reset();
  };

  const handleOpenEditModal = (sem) => {
    setSelectedSem(sem);
    setValue('semname', sem.semname); // Set the current name in the form
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    reset();
  };


  const handleEditFormSubmit = async (data) => {
    const payload = {
      semname: data.semname, userid: user?.id,
    };
    try {
      const res = await dispatch(updateSem({ id: selectedSem.id, userInput: payload }))
      if (res?.payload?.statusCodeValue === 200) {
        notification.success({ message: 'Semester updated successfully!' });
      }

      await dispatch(getAllSem());
      handleCloseEditModal();
    } catch {
      notification.error({ message: 'Failed to update semester.' });
    }
  };

  const handleDeleteSem = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this semester?',
      onOk: async () => {
        try {
          const userid = user?.id;
          const payload = { userid }
          const res = await dispatch(deletesem({ id: id, userInput: payload }))
          if (res?.payload?.statusCodeValue === 200) {
            notification.success({ message: 'Semester deleted successfully!' });
          }

          await dispatch(getAllSem());
        } catch (error) {
          notification.error({ message: 'Failed to delete semester.' });
        }
      },
    })
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Box sx={{ padding: '20px', paddingLeft: '45px' }}>
      {(user?.role === 'admin' || user?.role === 'pic') && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h4">
            Manage Semester
          </Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenModal}>
            Add Semester
          </Button>
        </Stack>
      )}
      <Typography variant="h4" textAlign="center" gutterBottom>
        Semesters
      </Typography>
      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        Explore the various semesters and their departments.
      </Typography>
      <Grid container spacing={10} sx={{ marginTop: '20px' }}>
        {sem?.body?.map((listsem, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
              maxWidth: 400,
              textAlign: 'center',
              boxShadow: 3,
              ':hover': {
                boxShadow: 20,
              },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                <School style={{ fontSize: 60, color: '#1976d2' }} />
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {listsem.semname}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Discover more about the {listsem.semname}.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Departments
                </Typography>
                <List dense>
                  {semDepartments[listsem.id]?.length > 0 ? (
                    semDepartments[listsem.id].map((dept) => (
                      <ListItem key={dept.id} disableGutters>
                        <ListItemIcon>
                          <BusinessOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={dept.deptname} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No departments available for this semester.
                    </Typography>
                  )}
                </List>
              </CardContent>

              <Modal
                title="Edit Semester"
                open={editModalOpen}
                onOk={handleSubmit(handleEditFormSubmit)}
                onCancel={handleCloseEditModal}
                okText="Update"
                cancelText="Cancel"
                maskStyle={{ backgroundColor: 'rgba(240, 236, 236, 0.3)' }}
              >
                <TextField
                  fullWidth
                  margin="normal"
                  label="Semester Name"
                  name="semname"
                  {...register('semname', { required: 'Semester name is required.' })}
                  error={!!errors.semname}
                  helperText={errors.semname?.message}
                />
              </Modal>

              {
                user?.role === 'admin' || user?.role === 'pic' ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 1 }}>
                      <Edit
                        sx={{ cursor: 'pointer', color: 'blue' }}
                        onClick={() => handleOpenEditModal(listsem)}
                      />
                      <Delete
                        sx={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDeleteSem(listsem.id)}
                      />
                    </Box>

                  </>
                ) : ''
              }

            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal
        title="Add New Semester"
        open={isModalOpen}
        onOk={handleSubmit(handleFormSubmit)}
        onCancel={handleCloseModal}
        okText="Add"
        cancelText="Cancel"
      >
        <TextField
          fullWidth
          margin="normal"
          label="Semester Name"
          name="semname"
          {...register('semname', { required: 'Semester name is required.' })}
          error={!!errors.semname}
          helperText={errors.semname?.message}
        />

      </Modal>
    </Box>
  );
};

export default AllSem;
