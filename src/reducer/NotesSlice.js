import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallnotes = createAsyncThunk(
  'allnotes/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/notes/allnotes");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const notesbySubId = createAsyncThunk(
  'notesbySubId/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/notes/notesbySubId/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updatenotes = createAsyncThunk(
  'updatenotes/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/notes/updateNotes/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteNotes = createAsyncThunk(
  'deleteNotesbyid/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/notes/deleteNotesbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addnotes = createAsyncThunk(
  'addnotes/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/notes/addnotes", userInput);
      
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const downloadPdf = createAsyncThunk(
  'notes/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notes/downloadpdf/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'notes_document.pdf'; // Filename for the downloaded file
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
  'notes/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/notes/uploadpdf/${id}/${role}`, formData, {
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
    notes:[],
    subnotes:[],
    uploadMessage: null,
}

const NotesSlice= createSlice(
    {
        name:"notes",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallnotes.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallnotes.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.notes=payload?.body

            })
            builder.addCase(getallnotes.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(notesbySubId.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(notesbySubId.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.subnotes=payload?.body

            })
            builder.addCase(notesbySubId.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addnotes.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addnotes.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(addnotes.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updatenotes.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updatenotes.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(updatenotes.rejected,(state)=>{
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


export default NotesSlice.reducer;
