import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, DialogActions, Box, TextField, Dialog, DialogTitle, DialogContent, Tab, Tabs, Button, FormControlLabel, Switch, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
import MessageIcon from '@mui/icons-material/Message';
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  UserAddOutlined,
  TeamOutlined,
  SolutionOutlined,
  CrownOutlined
} from '@ant-design/icons';
import ScoreIcon from '@mui/icons-material/Score';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { createroom, getallrooms, joinroom, roomcreatorId, roomparticipentId } from '../reducer/RoomSLice';
import { Avatar, notification, Spin } from 'antd';
import CryptoJS from 'crypto-js';
import { CalendarToday, People } from '@mui/icons-material';
import { getPic } from '../reducer/AuthSlice.js'

function Dashboard() {
  useEffect(() => {
    document.title = "Virtual Academy | Dashboard";
  }, []);
  const { rooms, roomsbypartipentsid, roomsbycreatorid, loading } = useSelector((state) => state.room);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userAvatars, setUserAvatars] = useState({});
  const [isPrivate, setIsPrivate] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = rooms?.filter(room =>
    room?.roomId.toString().includes(searchTerm.trim())
  );
  const filteredCreatedRooms = roomsbycreatorid?.filter(room =>
    room?.roomId.toString().includes(searchTerm.trim())
  );
  const filteredjoinRooms = roomsbypartipentsid?.filter(room =>
    room?.roomId.toString().includes(searchTerm.trim())
  );
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const enteredRoomId = watch('roomId');
  const fetchPic = async (id, gender) => {
    try {
      const resultAction = await dispatch(getPic({ id: id, gender: gender }));
      const image = resultAction.payload;
      return image
    } catch (error) {
      console.error('Failed to fetch picture:', error);
    }
  };
  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarMap = {};
      for (const room of rooms) {
        if (room.creator?.id && !avatarMap[room.creator.id]) {
          const avatarUrl = await fetchPic(room.creator.id, room.creator.gender);
          avatarMap[room.creator.id] = avatarUrl;
        }
      }
      setUserAvatars(avatarMap);
    };

    if (rooms?.length > 0) {
      fetchAvatars();
    }
  }, [rooms]);
  useEffect(() => {
    dispatch(getallrooms())
    dispatch(roomcreatorId(user?.id))
    dispatch(roomparticipentId(user?.id))
  }, [dispatch])
  const handleRoomAction = (feature) => {
    if (feature.title === 'Room') {
      setOpenRoomModal(true);
    } else {
      navigate(feature.path);
    }
  };

  const onSubmit = async (data) => {
    try {
      const secretKey = 'virtualacademy';
      const encryptedId = CryptoJS.AES.encrypt(enteredRoomId.toString(), secretKey).toString();
      const urlSafeEncryptedId = encodeURIComponent(encryptedId);
      if (activeTab === 0) {
        // Creating a room
        const payload = {
          roomId: data.roomId,
          name: data.name || '', // Optional field
          description: data.description || '', // Optional field
          isPrivate: data.isprivate, // 1 for private, 0 for public
          password: data.isprivate === 1 ? data.password : '', // Password only if private
          creatorid: user?.id
        };

        const res = await dispatch(createroom(payload))

        if (res?.payload?.statusCodeValue === 201) {
          notification.success({ message: 'Room Created successfully!' });
          setOpenRoomModal(false);
          navigate(`/user/chat/${urlSafeEncryptedId}`);
        }
      } else {
        // Joining a room
        const payload = {
          roomId: data.roomId,
          password: data.password, // Password is required to join
          joinid: user?.id
        };

        const res = await dispatch(joinroom(payload))

        if (res?.payload?.statusCodeValue === 200) {
          notification.success({ message: 'Room Joind successfully!' });
          setOpenRoomModal(false);
          navigate(`/user/chat/${urlSafeEncryptedId}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const features = [
    {
      title: 'Profile',
      description: 'View and edit your profile information.',
      icon: <UserOutlined style={{ fontSize: 40, color: '#1976d2' }} />,
      path: '/user/profile',
      roles: ['student', 'teacher', 'admin', 'hod', 'pic'],
    },
    {
      title: 'Inbox',
      description: 'Check recent updates and alerts.',
      icon: <BellOutlined style={{ fontSize: 40, color: '#ff9800' }} />,
      path: '/user/inbox',
      roles: ['student', 'teacher', 'admin', 'hod', 'pic'],
    },
    {
      title: 'Room',
      description: 'Check recent chat by joining a room.',
      icon: <MessageIcon style={{ fontSize: 40, color: '#ff9800' }} />,
      // path: '/user/chat',
      roles: ['student', 'teacher', 'admin', 'hod', 'pic'],
    },
    {
      title: 'Settings',
      description: 'Adjust your account and preferences.',
      icon: <SettingOutlined style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/settings',
      roles: ['student', 'teacher', 'admin', 'hod', 'pic'],
    },
    {
      title: 'Subject',
      description: 'Subjects offer.',
      icon: <DescriptionIcon style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/subject',
      roles: ['student', 'teacher', 'admin', 'hod', 'pic'],
    },
    {
      title: 'Marks',
      description: 'Marks.',
      icon: <ScoreIcon style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/marks',
      roles: ['student', 'teacher', 'admin', 'hod', 'pic'],
    },
    {
      title: 'Add Admin',
      description: 'Add New Admin.',
      icon: <UserAddOutlined style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/addadmin',
      roles: ['admin'],
    },
    {
      title: 'Add Teacher',
      description: 'Add New Teacher.',
      icon: <UserAddOutlined style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/addteacher',
      roles: ['admin'],
    },
    {
      title: 'Total Teacher',
      description: 'List of every Teacher.',
      icon: <TeamOutlined style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/teachers',
      roles: ['admin', 'student', 'hod', 'pic', 'teacher'],
    },
    {
      title: 'Total Student',
      description: 'List of every Student.',
      icon: <SolutionOutlined style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/students',
      roles: ['admin', 'student', 'teacher', 'hod', 'pic'],
    },
    {
      title: 'Total Admin',
      description: 'List of every Admin.',
      icon: <CrownOutlined style={{ fontSize: 40, color: '#4caf50' }} />,
      path: '/user/admins',
      roles: ['admin'],
    },
  ];

  const accessibleFeatures = features.filter((feature) => feature.roles.includes(userRole));

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        This is the main control panel where you can manage your account and access various features.
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {accessibleFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {/* Wrap the Card with motion.div to animate it */}
            <motion.div
              initial={{ opacity: 0, y: 100 }} // Initial state (invisible and slightly below)
              animate={{ opacity: 1, y: 0 }} // End state (fully visible and in place)
              transition={{ duration: 0.5, delay: index * 0.2 }} // Duration and delay for staggered animations
            >
              <Card elevation={3} style={{ borderRadius: '8px' }}>
                <CardActionArea onClick={() => handleRoomAction(feature)}>
                  <CardContent style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '15px' }}>{feature.icon}</div>
                    <Typography variant="h6">{feature.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Room Modal - Updated Tabs Section */}
      <Dialog open={openRoomModal} onClose={() => setOpenRoomModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Room Management</DialogTitle>
        <DialogContent>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => {
              setActiveTab(newValue);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 3,
              maxWidth: '100vw',
              overflowX: 'auto',
              '& .MuiTabs-scroller': {
                overflowX: 'auto'
              }
            }}


          >
            <Tab label="Create Room" sx={{ fontWeight: 600, minWidth: 120 }} value={0} />
            <Tab label="Join Room" sx={{ fontWeight: 600, minWidth: 120 }} value={1} />
            <Tab label="Available Rooms" sx={{ fontWeight: 600, minWidth: 120 }} value={2} />
            <Tab label="Created Rooms" sx={{ fontWeight: 600, minWidth: 120 }} value={3} />
            <Tab label="Joined Rooms" sx={{ fontWeight: 600, minWidth: 120 }} value={4} />
          </Tabs>
          {activeTab === 0 && (
            <Box component="form">
              {/* Room ID */}
              <TextField
                autoFocus
                margin="dense"
                label="Room ID"
                fullWidth
                variant="outlined"
                {...register('roomId', {
                  required: 'room Id is required', pattern: {
                    value: /^\S+$/, // Restrict spaces
                    message: "Room ID cannot contain spaces",
                  },
                }

                )}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, ""); // Remove spaces
                  setValue("roomId", value, { shouldValidate: true }); // Update value without spaces
                }}
                error={!!errors.roomId}
                helperText={errors.roomId?.message}
                required
              />

              {/* Room Name */}
              <TextField
                margin="dense"
                label="Room Name (Optional)"
                fullWidth
                variant="outlined"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              {/* Description */}
              <TextField
                margin="dense"
                label="Description (Optional)"
                fullWidth
                variant="outlined"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                multiline
                rows={2}
              />

              {/* Privacy Switch */}
              <FormControlLabel
                control={
                  <Switch
                    checked={isPrivate === 1}
                    onChange={(e) => {
                      const value = e.target.checked ? 1 : 0;
                      setIsPrivate(value);
                      setValue('isprivate', value); // Update React Hook Form
                    }}
                    color="primary"
                  />
                }
                label="Private Room"
                sx={{ mt: 1, mb: 1 }}
              />


              {/* Conditional Password Field */}
              {isPrivate === 1 && (
                <TextField
                  margin="dense"
                  label="Password *"
                  type="password"
                  fullWidth
                  variant="outlined"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  required
                />
              )}
            </Box>
          )}
          {
            activeTab === 1 && (
              /* Join Room Form */
              <Box component="form">
                <TextField
                  autoFocus
                  margin="dense"
                  label="Room ID"
                  fullWidth
                  variant="outlined"
                  {...register('roomId', {
                    required: 'room Id is required', pattern: {
                      value: /^\S+$/, // Restrict spaces
                      message: "Room ID cannot contain spaces",
                    },
                  })}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, ""); // Remove spaces
                    setValue("roomId", value, { shouldValidate: true }); // Update value without spaces
                  }}
                  error={!!errors.roomId}
                  helperText={errors.roomId?.message}
                  required
                />
                <TextField
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                // required
                />

              </Box>
            )}
          {activeTab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Search by Room ID"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              {filteredRooms?.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredRooms.map((room) => {
                    const createdAt = new Date(room.createdDate);
                    const formattedDate = createdAt.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                    const formattedTime = createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <Grid item xs={12} sm={12} md={12} key={room.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                            "&:hover": {
                              boxShadow: 6,
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            },
                          }}
                        >
                          <CardContent sx={{ flex: 1 }}>
                            {/* Room ID and Privacy Badge */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                🆔 {room.roomId}
                              </Typography>
                              {room.private ? (
                                <Chip label="Private" size="small" color="error" variant="outlined" />
                              ) : (
                                <Chip label="Public" size="small" color="success" variant="outlined" />
                              )}
                            </Box>

                            {/* Room Name and Description */}
                            <Typography variant="body1" sx={{
                              fontWeight: 500,
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {room.name || 'Unnamed Room'}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {room.description || "No description available"}
                            </Typography>

                            {/* Creator Info */}
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Avatar sx={{ width: 32, height: 32 }} src={userAvatars[room.creator?.id]}>
                                {room.creator?.email?.[0]?.toUpperCase() || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                  {room.creator?.email || 'Unknown Creator'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {room.creator?.role || 'Member'}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Room Metadata */}
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <People fontSize="small" />
                                  <Typography variant="caption">
                                    {room.participants?.length || 0} members
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <CalendarToday fontSize="small" />
                                  <Typography variant="caption">
                                    {formattedDate}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">
                                  Created at {formattedTime}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                          {
                            room.participants?.some(participant => participant.id === user?.id) ?
                              <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                  const secretKey = 'virtualacademy';
                                  const encryptedId = CryptoJS.AES.encrypt(room.roomId.toString(), secretKey).toString();
                                  const urlSafeEncryptedId = encodeURIComponent(encryptedId);
                                  navigate(`/user/chat/${urlSafeEncryptedId}`);
                                }}
                                sx={{ mt: 'auto' }}
                              >
                                Open Room
                              </Button> :
                              <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                  setActiveTab(1)
                                  setValue('roomId', room.roomId)
                                }}
                                sx={{ mt: 'auto' }}
                              >
                                Join Room
                              </Button>

                          }
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  No rooms available
                </Typography>
              )}
            </Box>
          )}
          {activeTab === 3 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Search by Room ID"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              {filteredCreatedRooms?.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredCreatedRooms.map((room) => {
                    const createdAt = new Date(room.createdDate);
                    const formattedDate = createdAt.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                    const formattedTime = createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <Grid item xs={12} sm={12} md={12} key={room.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                            "&:hover": {
                              boxShadow: 6,
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            },
                          }}
                        >
                          <CardContent sx={{ flex: 1 }}>
                            {/* Room ID and Privacy Badge */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                🆔 {room.roomId}
                              </Typography>
                              {room.private ? (
                                <Chip label="Private" size="small" color="error" variant="outlined" />
                              ) : (
                                <Chip label="Public" size="small" color="success" variant="outlined" />
                              )}
                            </Box>

                            {/* Room Name and Description */}
                            <Typography variant="body1" sx={{
                              fontWeight: 500,
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {room.name || 'Unnamed Room'}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {room.description || "No description available"}
                            </Typography>

                            {/* Creator Info */}
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Avatar sx={{ width: 32, height: 32 }} src={userAvatars[room.creator?.id]}>
                                {room.creator?.email?.[0]?.toUpperCase() || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                  {room.creator?.email || 'Unknown Creator'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {room.creator?.role || 'Member'}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Room Metadata */}
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <People fontSize="small" />
                                  <Typography variant="caption">
                                    {room.participants?.length || 0} members
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <CalendarToday fontSize="small" />
                                  <Typography variant="caption">
                                    {formattedDate}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">
                                  Created at {formattedTime}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>

                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                              const secretKey = 'virtualacademy';
                              const encryptedId = CryptoJS.AES.encrypt(room.roomId.toString(), secretKey).toString();
                              const urlSafeEncryptedId = encodeURIComponent(encryptedId);
                              navigate(`/user/chat/${urlSafeEncryptedId}`);
                            }}
                            sx={{ mt: 'auto' }}
                          >
                            Open Room
                          </Button>


                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  No rooms available
                </Typography>
              )}
            </Box>
          )}
          {activeTab === 4 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Search by Room ID"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              {filteredjoinRooms?.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredjoinRooms.map((room) => {
                    const createdAt = new Date(room.createdDate);
                    const formattedDate = createdAt.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                    const formattedTime = createdAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <Grid item xs={12} sm={12} md={12} key={room.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: "flex",
                            flexDirection: "column",
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                            "&:hover": {
                              boxShadow: 6,
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            },
                          }}
                        >
                          <CardContent sx={{ flex: 1 }}>
                            {/* Room ID and Privacy Badge */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                🆔 {room.roomId}
                              </Typography>
                              {room.private ? (
                                <Chip label="Private" size="small" color="error" variant="outlined" />
                              ) : (
                                <Chip label="Public" size="small" color="success" variant="outlined" />
                              )}
                            </Box>

                            {/* Room Name and Description */}
                            <Typography variant="body1" sx={{
                              fontWeight: 500,
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {room.name || 'Unnamed Room'}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {room.description || "No description available"}
                            </Typography>

                            {/* Creator Info */}
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Avatar sx={{ width: 32, height: 32 }} src={userAvatars[room.creator?.id]}>
                                {room.creator?.email?.[0]?.toUpperCase() || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                  {room.creator?.email || 'Unknown Creator'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {room.creator?.role || 'Member'}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Room Metadata */}
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <People fontSize="small" />
                                  <Typography variant="caption">
                                    {room.participants?.length || 0} members
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <CalendarToday fontSize="small" />
                                  <Typography variant="caption">
                                    {formattedDate}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">
                                  Created at {formattedTime}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>

                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                              const secretKey = 'virtualacademy';
                              const encryptedId = CryptoJS.AES.encrypt(room.roomId.toString(), secretKey).toString();
                              const urlSafeEncryptedId = encodeURIComponent(encryptedId);
                              navigate(`/user/chat/${urlSafeEncryptedId}`);
                            }}
                            sx={{ mt: 'auto' }}
                          >
                            Open Room
                          </Button>


                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  No rooms available
                </Typography>
              )}
            </Box>
          )}


        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {activeTab === 0 && (
            <>
              <Button
                onClick={() => setOpenRoomModal(false)}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                color="primary"
                size="large"
              >
                Create Room
              </Button>
            </>
          )
          }
          {activeTab === 1 &&
            (
              <>
                <Button
                  onClick={() => setOpenRoomModal(false)}
                  variant="outlined"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Join Room
                </Button>
              </>
            )
          }


        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
