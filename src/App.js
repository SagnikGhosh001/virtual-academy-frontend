import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import VerifyAccountPage from './pages/VerifyAccountPage';
import CustomNavbar from './components/CustomNavbar';
import Dept from './pages/Dept';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import { useEffect } from 'react';
import {setInitialLoginState } from './reducer/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './pages/NotFound';
import PrivateRoute from './routeProtection/PrivateRoute';
import Dashboard from './pages/DashBoard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UpdateProfile from './pages/UpdateProfile';
import UpdatePassword from './pages/UpdatePassword';
import { ToastContainer } from 'react-toastify';
import UpdateEmail from './pages/UpdateEmail';
import AddPhone from './pages/AddPhone';
import ForgotPassword from './pages/ForgotPassword';
import AddAdmin from './pages/AddAdmin';
import AddTeacher from './pages/AddTeacher';
import Feedback from './pages/Feedback';
import TotalStudents from './pages/TotalStudents';
import TotalTeacher from './pages/TotalTeacher';
import TotalAdmins from './pages/TotalAdmins';
import Notes from './pages/Notes';
import Marks from './pages/Marks';
import Subject from './pages/Subject';
import Sem from './pages/Sem';
import Inbox from './pages/Inbox';
import Books from './pages/Books';
import Attendance from './pages/Attendance';
import Topics from './pages/Topics';
import Assignments from './pages/Assignments';
import Syllabus from './pages/Syllabus';
import AssignmentUpload from './pages/AssignmentUpload';
import InternetStatus from './components/InternetStatus'




// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
function App() {
  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInitialLoginState());
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Router>
        <InternetStatus/>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verifyaccount" element={<VerifyAccountPage />} />
          <Route path="/dept" element={<Dept />} />
          <Route path="/sem" element={<Sem />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/syllabus/:deptId" element={<Syllabus />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NotFound />} />

          {/* Protecting routes with PrivateRoute */}
          <Route path="/user" element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="marks" element={<Marks />} />
            <Route path="updateprofile" element={<UpdateProfile />} />
            <Route path="updatepassword" element={<UpdatePassword />} />
            <Route path="updateemail" element={<UpdateEmail />} />
            <Route path="addphone" element={<AddPhone />} />
            <Route path="addadmin" element={<AddAdmin />} />
            <Route path="addteacher" element={<AddTeacher />} />
            <Route path="admins" element={<TotalAdmins />} />
            <Route path="teachers" element={<TotalTeacher />} />
            <Route path="students" element={<TotalStudents />} />
            <Route path="notes/:subjectId" element={<Notes />} />
            <Route path="topics/:subjectId" element={<Topics />} />
            <Route path="books/:subjectId" element={<Books />} />
            <Route path="attendance/:subjectId" element={<Attendance />} />
            <Route path="assignments/:subjectId" element={<Assignments />} />
            <Route path="subject" element={<Subject />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="assignmentuplaod/:assignmentId" element={<AssignmentUpload />} />

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
