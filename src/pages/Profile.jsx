import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Grid, Typography, Card, CardContent, Divider, Button, Box } from '@mui/material';
import { MailOutline, PhoneOutlined, SchoolOutlined, ClassOutlined, DeleteOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { adminbyid, deleteUserImage, getPic, studentbyid, teacherbyid, updateProfilePic } from '../reducer/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { message, Modal, notification, Spin } from 'antd';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { getAllSemByTeacherId } from '../reducer/SemSlice';

const Profile = () => {
  useEffect(() => {
      document.title = "Virtual Academy | Profile";
    }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { teachersem } = useSelector((state) => state?.sems);
  const fileInputRef = useRef(null);
  const handleRedirect = (path) => {
    navigate(path);
  };
  const [imageUrl, setImageUrl] = useState(null);
  // useEffect(() => {
  //   dispatch(getPic(user?.id)).then((result) => setImageUrl(result.payload));
  // }, [dispatch, user?.id]);

  useEffect(() => {
    const fetchPic = async () => {
      try {
        const resultAction = await dispatch(getPic({ id: user?.id, gender: user?.gender }));
        const image = resultAction.payload; // getPic returns the image URL
        setImageUrl(image); // Store the image URL
      } catch (error) {
        console.error('Failed to fetch picture:', error);
      }
    };
    fetchPic();
  }, [dispatch, user?.id]);
  useEffect(() => {
    if (user?.id && !isDataFetched && user?.role === "student") {
      dispatch(studentbyid(user.id));
      setIsDataFetched(true);
    }
    if (user?.id && !isDataFetched && user?.role === "admin") {
      dispatch(adminbyid(user.id));
      setIsDataFetched(true);
    }
    if (user?.id && !isDataFetched && (user?.role === "teacher" || user?.role === "hod" || user?.role === "pic")) {
      dispatch(teacherbyid(user.id));
      dispatch(getAllSemByTeacherId(user.id))
      // console.log(sem);


      setIsDataFetched(true);
    }
  }, [dispatch, user?.id, isDataFetched]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const payload = { id: user.id, file };
        const res = await dispatch(updateProfilePic(payload));
        // console.log(res);

        if (res?.payload?.statusCodeValue === 200) {
          message.success({ message: "Profile picture added successfully" })
        }
        setImageUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleDeleteImage = (event) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this image?',
      onOk: async () => {
        try {
          const payload = { currentUserId: user?.id, };

          await dispatch(deleteUserImage({ id: user?.id, userInput: payload }));
          const resultAction = await dispatch(getPic({ id: user?.id, gender: user?.gender }));
          notification.success({ message: 'Image deleted successfully!' });
          const image = resultAction.payload;
          setImageUrl(image);
        } catch (error) {
          console.error('Image deletion failed:', error);
          alert('Failed to delete image. Please try again.');
        }
      }
    });

  };


  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }
  const OnlineBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      borderRadius: '50%',
      height: '12px',  // Adjust size as needed
      width: '12px',   // Adjust size as needed
      border: `2px solid ${theme.palette.background.paper}`,
      bottom: 20,       // Fine-tune positioning
      right: 40,        // Fine-tune positioning
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  }));


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Card elevation={6} sx={{ maxWidth: 900, width: '100%', borderRadius: '12px',backgroundColor: '#f5f5f5', ':hover': {boxShadow: 20} }}>
        <CardContent>
          <Grid container spacing={4} alignItems="center">
            {/* Profile Picture and Name Section */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <OnlineBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant={user?.isonline ? 'dot' : 'standard'}
                >
                  <Box position="relative" display="inline-flex">

                    <Avatar

                      src={imageUrl}
                      alt={user?.name || 'Profile Image'}
                      sx={{
                        width: 150,
                        height: 150,
                        marginBottom: '16px',
                        border: '5px solid #1976d2',
                        cursor: 'pointer',
                         ':hover': {
                          boxShadow: 20,
                        },
                      }}
                      onClick={handleImageClick}
                    />
                    <DeleteOutline
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        padding: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                      onClick={(e) => handleDeleteImage(e)}
                    />
                  </Box>
                </OnlineBadge>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {user?.name || 'Name not available'}
                </Typography>
                {user?.role === 'student' &&
                  <Typography variant="body2" color="textSecondary">
                    Registration: {user?.reg || 'Not available'}
                  </Typography>
                }
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: '4px' }}>
                  {user?.gender || 'Gender not assigned'}
                </Typography>
              </Box>
            </Grid>

            {/* Profile Details Section */}
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }} gutterBottom>
                {user?.role.toUpperCase() || 'No role available'}
              </Typography>
              <Divider sx={{ margin: '15px 0' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <MailOutline sx={{ marginRight: '8px', color: '#1976d2' }} />
                    {user?.email || 'Email not available'}<br />
                    {user?.emailVerified ? '(verified)' : '(not verified)'
                      // <>
                      //   <Typography variant="body2">

                      //     <a href="/verifyaccount" style={{ color: "#1976d2" }}>
                      //       <u>(not verified)</u>
                      //     </a>
                      //   </Typography>
                      // </>
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneOutlined sx={{ marginRight: '8px', color: '#4caf50' }} />
                    {user?.phoneNo || 'Phone number not added'}<br />{user?.phoneNo ? (user?.phoneverified ? '(verified)' : '(not verified)') : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolOutlined sx={{ marginRight: '8px', color: '#ff9800' }} />
                    {user?.college || 'College not specified'}
                  </Typography>
                </Grid>
                {user?.semname && <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ClassOutlined sx={{ marginRight: '8px', color: '#ff5722' }} />
                    Semester: {user?.semname || 'Not assigned'}
                  </Typography>
                </Grid>}
                {/* {user?.sem && user?.sem.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <ClassOutlined sx={{ marginRight: '8px', color: '#ff5722' }} />
                      Semesters:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                      {user?.sem.map((semester) => (
                        <Typography
                          key={semester.id}
                          variant="body2"
                          color="textSecondary"
                          sx={{ marginRight: '20px', marginBottom: '8px' }} // Adjust spacing
                        >
                          {semester.semname}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                )} */}
                {
                  (user?.role === 'teacher' || user?.role === 'hod' || user?.role === 'pic') && (
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ClassOutlined sx={{ marginRight: '8px', color: '#ff5722' }} />
                        Semesters:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                        {teachersem?.map((semester) => (
                          <Typography
                            key={semester.id}
                            variant="body2"
                            color="textSecondary"
                            sx={{ marginRight: '20px', marginBottom: '8px' }} // Adjust spacing
                          >
                            {semester.semname}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  )
                }
                {user?.role !== "admin" && <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ClassOutlined sx={{ marginRight: '8px', color: '#009688' }} />
                    Department: {user?.deptname || 'Not assigned'}
                  </Typography>
                </Grid>}

              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ margin: '20px 0' }} />

          {/* Action Buttons */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" sx={{ padding: '10px 20px' }}

                onClick={() => {

                  handleRedirect('/user/updateprofile')
                }
                }

              >
                Edit Profile
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" sx={{ padding: '10px 20px' }} onClick={() => handleRedirect('/user/updatepassword')}>
                Change Password
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box >
  );
};

export default Profile;
