import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";


export const getallfeedback = createAsyncThunk(
  'allfeedback/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/feedback/allfeedback");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);

export const addfedback = createAsyncThunk(
    'addfeedback/slice',
    async (userInput) => {
      try {
        const response = await axiosInstance.post("/feedback/addfeedback", userInput);
        
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );
export const updatefeedback = createAsyncThunk(
    'updatefeedback/slice',
    async ({id,userInput}) => {
      try {
        const response = await axiosInstance.put(`/feedback/updatefeedback/${id}`, userInput);
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );
export const deleteFeedback = createAsyncThunk(
    'deletefeedbackbyid/slice',
    async ({id,userInput}) => {
      try {
        const response = await axiosInstance.delete(`/feedback/deleteFeedbackbyId/${id}`, {
          data: userInput,
        });
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );

const initialState={
    loading: false,
    msg:"",
    error:"",
    feedbacks:[],
    
}

const FeedbackSlice= createSlice(
    {
        name:"feedback",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallfeedback.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallfeedback.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.feedbacks=payload?.body

            })
            builder.addCase(getallfeedback.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addfedback.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(addfedback.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.feedbacks=payload?.body

            })
            builder.addCase(addfedback.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(updatefeedback.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(updatefeedback.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.feedbacks=payload?.body

            })
            builder.addCase(updatefeedback.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
        }
    }
)


export default FeedbackSlice.reducer;
