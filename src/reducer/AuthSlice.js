import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import LZString from "lz-string";


export const login = createAsyncThunk(
  'auth/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/user/login", userInput);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);


export const registerstudent = createAsyncThunk(
  'registerstudent/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/student/registerstudent", userInput)
      return response?.data
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const sendOtpToEmail = createAsyncThunk(
  'sendOtpToEmail/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/user/sendOtpEmail", userInput)
      return response
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const verifyotp = createAsyncThunk(
  'verifyotp/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/user/verifyEmail", userInput)
      return response
    } catch (error) {
      // console.log(error);

      notification.error({ message: error.response.data.message })
    }
  }
);

// export const register = createAsyncThunk(
//   'register/slice',
//   async (userInput) => {
//     try {
//       const response = await axiosInstance.post("/student/registerstudent", userInput);
//       return response?.data;
//     } catch (error) {
//       notification.error({ message: error.response.data.message })
//     }
//   }
// );
export const addadmin = createAsyncThunk(
  'addadmin/slice',
  async (userInput) => {
    try {


      const response = await axiosInstance.post("/admin/addadmin", userInput);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const addTeacher = createAsyncThunk(
  'addTeacher/slice',
  async ({ userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/teacher/registerTeacher", userInput);
      if (response?.status === 201) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const studentupdate = createAsyncThunk(
  'studentupdate/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/student/updateStudentDetails/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const adminUpdate = createAsyncThunk(
  'updateadmin/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/updateAdmin/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const adminupdate = createAsyncThunk(
  'adminupdate/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/updateAdmin/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const teacherupdate = createAsyncThunk(
  'teacherupdate/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/teacher/updateteacherdetails/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const teacherupdateothers = createAsyncThunk(
  'teacherupdateothers/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/teacher/updateteacherOthers/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const studentupdateothers = createAsyncThunk(
  'studentupdateothers/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/student/updateStudentOthers/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const updatepassword = createAsyncThunk(
  'updatepassword/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/updatePassword/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const forgotpassword = createAsyncThunk(
  'forgotpassword/slice',
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/forgetPassword`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const updateemail = createAsyncThunk(
  'updateemail/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {


      const response = await axiosInstance.put(`/user/updateEmail/${id}`, userInput);
      if (response?.status === 200) {
        return response?.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const updatephone = createAsyncThunk(
  'updatephone/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/updatePhone/${id}`, userInput);


      if (response?.status === 200) {
        return response;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const deleteUserImage = createAsyncThunk(
  'deleteimage/slice',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.put(`/user/deleteuserpic/${id}`, userInput);


      if (response?.status === 200) {
        return response.data;
      }
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);

export const studentbyid = createAsyncThunk(
  'studentbyid/slice',
  async (id) => {
    try {
      const response = await axiosInstance.get(`/student/studentbyId/${id}`);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const adminbyid = createAsyncThunk(
  'adminbyid/slice',
  async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/adminbyId/${id}`);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const teacherbyid = createAsyncThunk(
  'teacherbyid/slice',
  async (id) => {
    try {
      const response = await axiosInstance.get(`/teacher/teacherById/${id}`);
      // console.log(response?.data?.body);

      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);

export const getPic = createAsyncThunk(
  'pic/slice',
  async ({ id, gender }) => {
    try {
      const response = await axiosInstance.get(`/user/download/${id}`, {
        responseType: 'blob'
      });
      let imageUrl;
      if (response?.data?.size === 0) {
        const normalizedGender = gender?.toLowerCase();

        imageUrl = normalizedGender === 'female'
          ? 'https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg'
          : 'https://www.svgrepo.com/show/382101/male-avatar-boy-face-man-user.svg';


      } else {
        imageUrl = URL.createObjectURL(new Blob([response.data]));
      }


      return imageUrl;
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
);

export const deleteTeacherSemesterById = createAsyncThunk(
  'auth/deleteTeacherSemesterById',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/teacher/deleteParticularSemOfTeacherbyId/${id}`, {
        data: userInput,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTeacherDepartmentById = createAsyncThunk(
  'auth/deleteTeacherDepartmentById',
  async ({ id, userInput }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/teacher/deleteParticularDeptOfTeacherbyId/${id}`, {
        data: userInput,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// In AuthSlice or respective slice
export const updateProfilePic = createAsyncThunk(
  'auth/updateProfilePic',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post(`/user/uploaduserpic/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating profile picture');
    }
  }
);


export const deleteTeacher = createAsyncThunk(
  'deleteteacherbyid/slice',
  async ({ id, userInput }) => {
    try {
      const response = await axiosInstance.delete(`/teacher/deleteteacherbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {

      notification.error({ message: error.response.data.message })


    }
  }
);
export const deleteStudent = createAsyncThunk(
  'deletestudentbyid/slice',
  async ({ id, userInput }) => {
    try {
      const response = await axiosInstance.delete(`/student/deleteStudentbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const deleteAdmin = createAsyncThunk(
  'deleteadminbyid/slice',
  async ({ id, userInput }) => {
    try {
      const response = await axiosInstance.delete(`/admin/deleteAdminbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const blockedStudent = createAsyncThunk(
  'blockedstudentbyid/slice',
  async ({ id, userInput }) => {
    try {
      const response = await axiosInstance.put(`/user/blocked/${id}`, userInput,);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const online = createAsyncThunk(
  'online/slice',
  async (id) => {
    try {
      const response = await axiosInstance.put(`/user/online/${id}`);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const offline = createAsyncThunk(
  'offline/slice',
  async (id) => {
    try {
      const response = await axiosInstance.put(`/user/offline/${id}`);
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);

export const allstudents = createAsyncThunk(
  'allstudents/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/student/allStudent");
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const alladmin = createAsyncThunk(
  'alladmin/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/admin/allAdmin");
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);
export const allteacher = createAsyncThunk(
  'allteacher/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/teacher/allteacher");
      return response?.data;
    } catch (error) {
      notification.error({ message: error.response.data.message })
    }
  }
);

const initialState = {
  loading: false,
  apploading: true,
  msg: '',
  error: '',
  islogin: false,
  user: [],
  image: null,
  userlist: [],
};

const AuthSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setInitialLoginState: (state) => { 
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        state.islogin = true;
        const decompressedData = JSON.parse(LZString.decompress(localStorage.getItem("user")));
        state.user = decompressedData || [];
      } else {        
        state.islogin = false;
      }
      state.apploading = false;
    },
    logout: (state) => {
      state.islogin = false;
      state.user = [];
      state.image = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },


  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.islogin = false
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        if (payload?.body?.token) {
          let token = payload?.body?.token;
          state.loading = false;
          const compressedData = LZString.compress(JSON.stringify(payload?.body?.user));
          localStorage.setItem("user", compressedData);
          localStorage.setItem("token", JSON.stringify({ 'token': token }));
          // localStorage.setItem("user", JSON.stringify(payload?.body?.user));
          state.islogin = true;

          state.user = payload?.body?.user;
        } else {
          state.error = "Invalid credentials";
          state.islogin = false;
          state.loading = false;
        }
      })
      .addCase(login.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
        state.islogin = false;
      })
      .addCase(studentupdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(studentupdate.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(studentupdate.rejected, (state, { payload }) => {
        state.error = payload?.data;
        state.loading = false;
      })
      .addCase(registerstudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerstudent.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(registerstudent.rejected, (state, { payload }) => {
        state.error = payload?.data;
        state.loading = false;
      })
      .addCase(sendOtpToEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtpToEmail.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(sendOtpToEmail.rejected, (state, { payload }) => {
        state.error = payload?.data?.response?.data?.message;


        state.loading = false;
      })
      .addCase(verifyotp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyotp.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(verifyotp.rejected, (state, { payload }) => {
        state.error = payload?.data?.response?.data?.message;


        state.loading = false;
      })
      .addCase(adminupdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminupdate.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(adminupdate.rejected, (state, { payload }) => {
        state.error = payload?.data;
        state.loading = false;
      })
      .addCase(teacherupdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(teacherupdate.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(teacherupdate.rejected, (state, { payload }) => {
        state.error = payload?.data;
        state.loading = false;
      })
      .addCase(teacherupdateothers.pending, (state) => {
        state.loading = true;
      })
      .addCase(teacherupdateothers.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(teacherupdateothers.rejected, (state, { payload }) => {
        state.error = payload?.data;
        state.loading = false;
      })
      .addCase(studentupdateothers.pending, (state) => {
        state.loading = true;
      })
      .addCase(studentupdateothers.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(studentupdateothers.rejected, (state, { payload }) => {
        state.error = payload?.data;
        state.loading = false;
      })

      .addCase(getPic.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPic.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.image = payload;
      })
      .addCase(getPic.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(studentbyid.pending, (state) => {
        state.loading = true;
      })
      .addCase(studentbyid.fulfilled, (state, { payload }) => {
        state.loading = false;

        state.user = payload?.body;


        const compressedData = LZString.compress(JSON.stringify(payload?.body));
        localStorage.setItem("user", compressedData);

        // localStorage.setItem("user", JSON.stringify(payload?.body));
      })

      .addCase(studentbyid.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(adminbyid.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminbyid.fulfilled, (state, { payload }) => {
        state.loading = false;

        state.user = payload?.body;
        const compressedData = LZString.compress(JSON.stringify(payload?.body))
        localStorage.setItem("user", compressedData)
        // localStorage.setItem("user", JSON.stringify(payload?.body));
      })
      .addCase(adminbyid.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(teacherbyid.pending, (state) => {
        state.loading = true;
      })
      .addCase(teacherbyid.fulfilled, (state, { payload }) => {
        state.loading = false;

        state.user = payload?.body;
        const compressedData = LZString.compress(JSON.stringify(payload?.body))
        localStorage.setItem("user", compressedData)
        // localStorage.setItem("user", JSON.stringify(payload?.body));
      })
      .addCase(teacherbyid.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(updatepassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatepassword.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(updatepassword.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(updateemail.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateemail.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(updateemail.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(updatephone.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatephone.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(updatephone.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(forgotpassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotpassword.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(forgotpassword.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(addadmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(addadmin.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(addadmin.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(addTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTeacher.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(addTeacher.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(allteacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(allteacher.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userlist = payload?.body
      })
      .addCase(allteacher.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(allstudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(allstudents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userlist = payload?.body
      })
      .addCase(allstudents.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(alladmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(alladmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userlist = payload?.body
      })
      .addCase(alladmin.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTeacher.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(deleteTeacher.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(deleteStudent.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(blockedStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(blockedStudent.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(blockedStudent.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(online.pending, (state) => {
        state.loading = true;
      })
      .addCase(online.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(online.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(offline.pending, (state) => {
        state.loading = true;
      })
      .addCase(offline.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(offline.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(updateProfilePic.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfilePic.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(updateProfilePic.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(deleteTeacherDepartmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTeacherDepartmentById.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(deleteTeacherDepartmentById.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(deleteTeacherSemesterById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTeacherSemesterById.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(deleteTeacherSemesterById.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(deleteUserImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserImage.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(deleteUserImage.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.userlist=payload?.body
      })
      .addCase(deleteAdmin.rejected, (state) => {
        state.error = "something went wrong";
        state.loading = false;
      })
  }
});

export const { setInitialLoginState, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
