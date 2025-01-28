import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getalltopic = createAsyncThunk(
  'alltopic/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/topic/alltopic");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const topicbySubId = createAsyncThunk(
  'topicbySubId/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/topic/topicbySubId/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updatetopic = createAsyncThunk(
  'updatetopic/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/topic/updatetopic/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteTopicbyId = createAsyncThunk(
  'deleteTopicbyId/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/topic/deleteTopicbyId/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addtopic = createAsyncThunk(
  'addtopic/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/topic/addtopic", userInput);
      
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
      const response = await axiosInstance.get(`/topic/downloadpdf/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'topic_document.pdf'; // Filename for the downloaded file
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
  'topic/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/topic/uploadpdf/${id}/${role}`, formData, {
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
    topics:[],
    subtopics:[],
    uploadMessage: null,
}

const TopicSlice= createSlice(
    {
        name:"topic",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getalltopic.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getalltopic.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.topics=payload?.body

            })
            builder.addCase(getalltopic.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(topicbySubId.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(topicbySubId.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.subtopics=payload?.body

            })
            builder.addCase(topicbySubId.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addtopic.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addtopic.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(addtopic.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updatetopic.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updatetopic.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
              // state.notes=payload?.body

          })
          builder.addCase(updatetopic.rejected,(state)=>{
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


export default TopicSlice.reducer;
