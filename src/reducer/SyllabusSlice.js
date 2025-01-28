import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallsyllabus = createAsyncThunk(
  'allsyllabus/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/syllabus/allsyllabus");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const syllabusbyDeptId = createAsyncThunk(
  'syllabusbyDeptId/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/syllabus/syllabusbyDeptId/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updatesyllabus = createAsyncThunk(
  'updatesyllabus/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/syllabus/updatesyllabus/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteSyllabusbyId = createAsyncThunk(
  'deleteNotesbyid/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/syllabus/deleteSyllabusbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addsyllabus = createAsyncThunk(
  'addsyllabus/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/syllabus/addsyllabus", userInput);
      
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const downloadPdf = createAsyncThunk(
  'syllabus/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/syllabus/downloadpdf/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'syllabus_document.pdf'; // Filename for the downloaded file
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
  'syllabus/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/syllabus/uploadpdf/${id}/${role}`, formData, {
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
    syllabuses:[],
    deptsyllabus:[],
    uploadMessage: null,
}

const SyllabusSlice= createSlice(
    {
        name:"syllabus",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallsyllabus.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallsyllabus.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.syllabuses=payload?.body

            })
            builder.addCase(getallsyllabus.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(syllabusbyDeptId.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(syllabusbyDeptId.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.deptsyllabus=payload?.body

            })
            builder.addCase(syllabusbyDeptId.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addsyllabus.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addsyllabus.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(addsyllabus.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updatesyllabus.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updatesyllabus.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(updatesyllabus.rejected,(state)=>{
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


export default SyllabusSlice.reducer;
