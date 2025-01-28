import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";

export const getAllDept = createAsyncThunk(
    'dept/slice',
    async () => {
        try {
            const response = await axiosInstance.get("/dept/allDept")
            
            return response?.data
        } catch (error) {
            notification.error({message:error.response.data.message})
        }

    }
)
export const updateDept = createAsyncThunk(
    'updateDept/slice',
    async ({id,userInput}) => {
      try {
        const response = await axiosInstance.put(`/dept/updateDept/${id}`, userInput);
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );
  export const deleteDepartmentSemesterById = createAsyncThunk(
    'auth/deleteTeacherSemesterById',
    async ({ id, userInput }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/dept/deleteParticularSemOfDeptbyId/${id}`, {
                data: userInput,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
  );
export const getAllDeptbysemid = createAsyncThunk(
    'allDeptbysemid/slice',
    async (id) => {
        try {
            const response = await axiosInstance.get(`/dept/allDeptbysemid/${id}`)
            
            return response?.data
        } catch (error) {
            notification.error({message:error.response.data.message})
        }

    }
)
export const adddept = createAsyncThunk(
    'adddept/slice',
    async (userInput) => {
      try {
        // console.log(userInput,'userInput');
        const response = await axiosInstance.post("/dept/addDept", userInput);
        
        return response?.data;
      } catch (error) {
        notification.error({message:error.response.data.message})
      }
    }
  );

  export const deletedept = createAsyncThunk(
    'deleteDeptbyId/slice',
    async ({id,userInput}) => {
      try {
        const response = await axiosInstance.delete(`/dept/deleteDeptbyId/${id}`, {
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
    dept:[]
}

const DeptSlice= createSlice(
    {
        name:"dept",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getAllDept.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getAllDept.fulfilled,(state,{payload})=>{
               
                state.loading=false
                state.dept=payload
               
                

            })
            builder.addCase(getAllDept.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(getAllDeptbysemid.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getAllDeptbysemid.fulfilled,(state,{payload})=>{
               
                state.loading=false
                // state.dept=payload
               
                

            })
            builder.addCase(getAllDeptbysemid.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(adddept.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(adddept.fulfilled,(state,{payload})=>{
                state.loading=false
            })
            builder.addCase(adddept.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(updateDept.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(updateDept.fulfilled,(state,{payload})=>{
                state.loading=false
            })
            builder.addCase(updateDept.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(deletedept.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(deletedept.fulfilled,(state,{payload})=>{
                state.loading=false
            })
            builder.addCase(deletedept.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
        }
    }
)

export default DeptSlice.reducer