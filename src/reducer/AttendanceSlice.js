import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallattendence = createAsyncThunk(
  'getallattendence/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/attendence/getallattendence");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const getattendencebysubid = createAsyncThunk(
  'getattendencebysubid/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/attendence/getattendencebysubid/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updateattendence = createAsyncThunk(
  'updateattendence/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/attendence/updateattendence/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteattendencebyId = createAsyncThunk(
  'deleteattendencebyId/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/attendence/deleteattendencebyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addattendence = createAsyncThunk(
  'addattendence/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/attendence/addattendence", userInput);
      
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const downloadPdf = createAsyncThunk(
  'attendence/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/attendence/downloadpdf/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'attendence.pdf'; // Filename for the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Download failed');
    }
  }
);

export const uploadPdf = createAsyncThunk(
  'attendence/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/attendence/uploadpdf/${id}/${role}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response.data; // Returns the success message from the backend
      } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
      }
  }
);
const initialState={
    loading: false,
    msg:"",
    error:"",
    attendance:[],
    subattendance:[],
    uploadMessage: null,
}

const AttendanceSlice= createSlice(
    {
        name:"notes",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallattendence.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallattendence.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.attendance=payload?.body

            })
            builder.addCase(getallattendence.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(getattendencebysubid.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getattendencebysubid.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.subattendance=payload?.body
                
                
            })
            builder.addCase(getattendencebysubid.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addattendence.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addattendence.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              state.notes=payload?.body

          })
          builder.addCase(addattendence.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updateattendence.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updateattendence.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              state.notes=payload?.body

          })
          builder.addCase(updateattendence.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            .addCase(downloadPdf.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(downloadPdf.fulfilled, (state) => {
              state.loading = false;
            })
            .addCase(downloadPdf.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Something went wrong';
            })
            .addCase(uploadPdf.pending, (state) => {
              state.loading = true;
              state.error = null;
              state.uploadMessage = null;
          })
          .addCase(uploadPdf.fulfilled, (state, action) => {
              state.loading = false;
              state.uploadMessage = action.payload;
          })
          .addCase(uploadPdf.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Failed to upload the PDF';
          });
            
        }
    }
)


export default AttendanceSlice.reducer;
