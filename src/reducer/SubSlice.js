import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";

export const getAllSub = createAsyncThunk(
    'sub/slice',
    async () => {
        try {
            const response = await axiosInstance.get("/sub/allsub")
            
            // console.log(response?.data?.body,'res');
            
            return response?.data?.body
        } catch (error) {
            notification.error({message:error.response.data.message})
        }

    }
)
// export const getAllSub = createAsyncThunk(
//     'sub/slice',
//     async () => {
//         try {
//             const response = await axiosInstance.get("/sub/allsub")
            
//             // console.log(response?.data?.body,'res');
            
//             return response?.data?.body
//         } catch (error) {
//             notification.error({message:error.response.data.message})
//         }

//     }
// )
export const addsub = createAsyncThunk(
    'addsub/slice',
    async (userInput) => {
      try {
        const response = await axiosInstance.post("/sub/addsub", userInput);
        
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );
export const updatesub = createAsyncThunk(
    'updatesub/slice',
    async ({id,userInput}) => {
      try {
        const response = await axiosInstance.put(`/sub/updateSub/${id}`, userInput);
        // console.log(response);
        
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );
export const deletesub = createAsyncThunk(
    'deletesubbyid/slice',
    async ({id,userInput}) => {
      try {
        const response = await axiosInstance.delete(`/sub/deleteSubbyId/${id}`, {
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
    subs:[]
}

const SubSlice= createSlice(
    {
        name:"subs",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getAllSub.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getAllSub.fulfilled,(state,{payload})=>{
               
                state.loading=false
                
                // console.log(payload);
                
                state.subs=payload

            })
            builder.addCase(getAllSub.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addsub.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(addsub.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.feedbacks=payload?.body

            })
            builder.addCase(addsub.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(updatesub.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(updatesub.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.feedbacks=payload?.body

            })
            builder.addCase(updatesub.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(deletesub.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(deletesub.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                // state.feedbacks=payload?.body

            })
            builder.addCase(deletesub.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
        }
    }
)

export default SubSlice.reducer