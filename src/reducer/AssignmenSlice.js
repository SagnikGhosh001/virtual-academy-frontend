import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallassignment = createAsyncThunk(
  'allassignment/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/assignment/allassignment");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const assignmentbysubid = createAsyncThunk(
  'assignmentbysubid/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/assignment/assignmentbysubid/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updateassignment = createAsyncThunk(
  'updateassignment/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/assignment/updateassignment/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteassignmentbyId = createAsyncThunk(
  'deleteassignmentbyId/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/assignment/deleteassignmentbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addassignment = createAsyncThunk(
  'addassignment/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/assignment/addassignment", userInput);
      
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const downloadPdf = createAsyncThunk(
  'topic/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/assignment/downloadpdf/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'assignment_document.pdf'; // Filename for the downloaded file
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
  'assignment/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/assignment/uploadpdf/${id}/${role}`, formData, {
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
    assignments:[],
    subassignments:[],
    uploadMessage: null,
}

const AssignmentSlice= createSlice(
    {
        name:"assignment",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallassignment.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallassignment.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.assignments=payload?.body

            })
            builder.addCase(getallassignment.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(assignmentbysubid.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(assignmentbysubid.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.subassignments=payload?.body

            })
            builder.addCase(assignmentbysubid.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addassignment.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addassignment.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(addassignment.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updateassignment.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updateassignment.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(updateassignment.rejected,(state)=>{
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


export default AssignmentSlice.reducer;
