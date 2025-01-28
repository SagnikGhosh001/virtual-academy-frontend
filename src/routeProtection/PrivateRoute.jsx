import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

const PrivateRoute = () => {
  const { islogin, loading } = useSelector((state) => state.auth);

  // if (loading) {
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  
  return islogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
