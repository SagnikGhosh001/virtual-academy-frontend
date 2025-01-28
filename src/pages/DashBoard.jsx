import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
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

function Dashboard() {
  useEffect(() => {
      document.title = "Virtual Academy | Dashboard";
    }, []);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;

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
                <CardActionArea onClick={() => navigate(feature.path)}>
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
    </div>
  );
}

export default Dashboard;
