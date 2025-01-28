import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallMarks = createAsyncThunk(
  'allMarks/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/marks/allMarks");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const marksByReg = createAsyncThunk(
  'marksByReg/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/marks/marksByReg/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const marksByStudentid = createAsyncThunk(
  'marksByStudentId/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/marks/marksByStudentId/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updatemarks = createAsyncThunk(
  'updatemarks/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/marks/updatemarks/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deletemarks = createAsyncThunk(
  'deletemarks/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/marks/deletemarks/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addmarks = createAsyncThunk(
  'addmarks/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/marks/addmarks", userInput);
      
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const downloadPdf = createAsyncThunk(
  'marks/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/marks/downloadpdf/${id}`, {
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
  'marks/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/marks/uploadpdf/${id}/${role}`, formData, {
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
    marks:[],
    regmarks:[],
    studentmarks:[],
    uploadMessage: null,
}

const MarksSlice= createSlice(
    {
        name:"notes",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallMarks.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallMarks.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.marks=payload?.body

            })
            builder.addCase(getallMarks.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(marksByReg.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(marksByReg.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.regmarksg=payload?.body
                
                
            })
            builder.addCase(marksByReg.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addmarks.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addmarks.fulfilled,(state,{payload})=>{
              
              state.loading=false

          })
          builder.addCase(addmarks.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updatemarks.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updatemarks.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              state.notes=payload?.body

          })
          builder.addCase(updatemarks.rejected,(state)=>{
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


export default MarksSlice.reducer;
