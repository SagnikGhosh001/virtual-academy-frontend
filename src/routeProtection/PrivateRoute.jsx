import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

const PrivateRoute = () => {
  const { islogin, loading,user } = useSelector((state) => state.auth);


  return islogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
