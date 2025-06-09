import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, FormControlLabel, Switch } from '@mui/material';
import { notification, Spin, Rate, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { alladmin, allstudents, deleteAdmin, getPic } from '../reducer/AuthSlice';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const TotalAdmins = () => {
    useEffect(() => {
        document.title = "Virtual Academy | Total Admins";
      }, []);
    const { user, islogin, userlist, loading } = useSelector((state) => state.auth);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFeedbackId, setEditFeedbackId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showUserFeedbackFirst, setShowUserFeedbackFirst] = useState(true);
    const [profilePictures, setProfilePictures] = useState({});
    useEffect(() => {
        dispatch(alladmin());
    }, [dispatch]);



    const sortedFeedbacks = showUserFeedbackFirst
        ? [
            ...((userlist || []).filter((userlist) => userlist.email === user?.email)),
            ...((userlist || []).filter((userlist) => userlist.email !== user?.email)),
        ]
        : userlist || [];
    useEffect(() => {
        dispatch(alladmin()).then(({ payload }) => {
            const admins = payload?.body || []; // Adjust according to the actual structure
            admins.forEach((admin) => {
                dispatch(getPic({ id: admin?.id, gender: admin?.gender })).then((result) => {
                    setProfilePictures((prev) => ({
                        ...prev,
                        [admin.id]: result.payload,
                    }));
                });
            });
        });
    }, [dispatch]);
    const handleDeleteClick = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this admin?',
            onOk: async () => {
                try {
                    const userid = user?.id
                    const payload = { userid }
                    const res = await dispatch(deleteAdmin({ id: id, userInput: payload }))
                    if (res?.payload?.statusCodeValue === 200) {
                        notification.success({ message: 'Admin deleted successfully!' });
                    }
                    dispatch(alladmin());
                } catch (error) {
                    notification.error({ message: 'Failed to delete admin.' });
                }
            },
        });
    };
    const handleEditClick = (id) => {
        // Modal.confirm({
        //   title: 'Are you sure you want to delete this admin?',
        //   onOk: async () => {
        //     try {
        //       const userId = user?.id
        //       const payload = { userId }
        //       await dispatch(deleteAdmin({ id: id, userInput: payload })).unwrap();
        //       notification.success({ message: 'Admin deleted successfully!' });
        //       dispatch(allstudents());
        //     } catch (error) {
        //       notification.error({ message: 'Failed to delete admin.' });
        //     }
        //   },
        // });
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
        { field: 'serialNo', headerName: 'S.No.', width: 80 ,renderCell: (params) => params.api.getAllRowIds().indexOf(params.id)+1},
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
        { field: 'name', headerName: 'Name', width: 150, sortable: true },
        // { field: 'isonline', headerName: 'Online', width: 50, renderCell: (params) => (params.value ? 'Yes' : 'No') },
        { field: 'gender', headerName: 'Gender', width: 100, sortable: true },
        { field: 'email', headerName: 'Email ID', width: 200, sortable: true },
        // { field: 'emailVerified', headerName: 'Email Verified', sortable: true, valueFormatter: (params) => params.value ? 'Yes' : 'No' },

        { field: 'phone', headerName: 'Phone No', width: 250, sortable: true,renderCell: (params) => (params.value ? params.value : 'Not Given') },
        { field: 'college', headerName: 'College', width: 250, sortable: true },
        { field: 'createdby', headerName: 'Created By', width: 200, sortable: true },
        // {
        //     field: 'createdAt',
        //     headerName: 'Created At',
        //     width: 150,
        //     sortable: true,
        //     valueGetter: (params) =>
        //         dayjs(params.row.createdAt).isValid()
        //             ? dayjs(params.row.createdAt).format('DD/MM/YYYY HH:mm')
        //             : 'N/A',
        // },
        // {
        //     field: 'modifiedAt',
        //     headerName: 'Updated At',
        //     width: 150,
        //     sortable: true,
        //     valueGetter: (params) =>
        //         dayjs(params.row.modifiedAt).isValid()
        //             ? dayjs(params.row.modifiedAt).format('DD/MM/YYYY HH:mm')
        //             : 'Never Updated',
        // },
        { field: 'createdAt', headerName: 'Created At', sortable: true,
            renderCell: (params) =>
        dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
         },
        { field: 'modifiedAt', headerName: 'Updated At', sortable: true ,
            renderCell: (params) =>
        dayjs(params.value).isValid() ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : 'N/A',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    {
                        (user?.id === params.row.id || user?.email === 'sagnikghosh904@gmail.com') && (
                            <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        )
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
                Admins
            </Typography>
            <Typography variant="subtitle1" textAlign="center" gutterBottom>
                View our admins.
            </Typography>

            <Box sx={{ marginTop: '30px' }}>
                <FormControlLabel
                    control={<Switch checked={showUserFeedbackFirst} onChange={() => setShowUserFeedbackFirst(!showUserFeedbackFirst)} />}
                    label="Show my name first"
                />
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={sortedFeedbacks}
                        columns={columns}
                        pageSize={5}
                        pagination
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            </Box>
        </Box>
    );
};

export default TotalAdmins;
