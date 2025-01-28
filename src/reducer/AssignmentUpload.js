import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const allAssignmentUpload = createAsyncThunk(
  'allAssignmentUpload/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/assignmentUploads/allAssignmentUpload");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const assignmentUploadByAssignmentId = createAsyncThunk(
  'assignmentUploadByAssignmentId/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/assignmentUploads/assignmentUploadByAssignmentId/${id}`);  
    //   console.log(response?.data); 
      return response?.data;
      
      
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updateAssignmentUpload = createAsyncThunk(
  'updateAssignmentUpload/slice',
  async ({id,userInput}) => {
    try {
      const formData = new FormData();
        formData.append('assignmentId', userInput.assignmentId);
        formData.append('teacherId', userInput.teacherId);
        formData.append('marks', userInput.marks);
        formData.append('remarks', userInput.remarks);
        formData.append('annotatedPdf', userInput.annotatedPdf);
      const response = await axiosInstance.put(`/assignmentUploads/updateAssignmentUpload/${id}`, formData
        , {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
    });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteAssignmentUploadById = createAsyncThunk(
  'deleteAssignmentUploadById/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/assignmentUploads/deleteAssignmentUploadById/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addAssignmentUpload = createAsyncThunk(
    'addAssignmentUpload/slice',
    async (userInput) => {
      try {
        const formData = new FormData();
        formData.append('assignmentId', userInput.assignmentId);
        formData.append('studentId', userInput.studentId);
        formData.append('file', userInput.file[0]);
        const response = await axiosInstance.post("/assignmentUploads/addAssignmentUpload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        });
  
        return response?.data;
      } catch (error) {
        notification.error({message: error.response?.data?.message || 'Error uploading assignment'});
      }
    }
  );
  
export const downloadPdf = createAsyncThunk(
  'assignmentUploads/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/assignmentUploads/download/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'assignmentUploads.pdf'; // Filename for the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Download failed');
    }
  }
);
export const downloadBlobPdf = createAsyncThunk(
  'assignmentUploads/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/assignmentUploads/download/${id}`, {
          responseType: 'arraybuffer', // To handle binary data
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        return blob; // Return the Blob for use in annotations
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Download failed');
      }
  }
);

export const uploadPdf = createAsyncThunk(
  'assignmentUploads/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/assignmentUploads/uploadpdf/${id}/${role}`, formData, {
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
    assignmentUploads:[],
    assignmentAssignmentUploads:[],
    uploadMessage: null,
}

const AssignmentUploadSlice= createSlice(
    {
        name:"assignmentUpload",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(allAssignmentUpload.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(allAssignmentUpload.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.assignmentUploads=payload?.body

            })
            builder.addCase(allAssignmentUpload.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(assignmentUploadByAssignmentId.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(assignmentUploadByAssignmentId.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.assignmentAssignmentUploads=payload?.body

            })
            builder.addCase(assignmentUploadByAssignmentId.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addAssignmentUpload.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addAssignmentUpload.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(addAssignmentUpload.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updateAssignmentUpload.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updateAssignmentUpload.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(updateAssignmentUpload.rejected,(state)=>{
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


export default AssignmentUploadSlice.reducer;
