import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "./Api"
import { notification } from "antd"

export const getInbox = createAsyncThunk(
    'getInbox/slice',
    async () => {
        const response = await axiosInstance.get("/inbox/allInbox")
        return response?.data
        
        
    }
)
export const getInboxByStudentid = createAsyncThunk(
    'getInboxByStudentid/slice',
    async (id) => {
        const response = await axiosInstance.get(`/inbox/inboxByStudentId/${id}`)
        return response?.data
        
        
    }
)
export const inboxByTeacherId = createAsyncThunk(
    'inboxByTeacherId/slice',
    async (id) => {
        const response = await axiosInstance.get(`/inbox/inboxByTeacherId/${id}`)
        return response?.data
        
        
    }
)
export const addInbox = createAsyncThunk(
    'addInbox/slice',
    async (userInput) => {
        try {
            console.log(userInput, 'userInput');
            const response = await axiosInstance.post("/inbox/addinbox", userInput);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);

export const updateInbox = createAsyncThunk(
    'updateInbox/slice',
    async ({ id, userInput }) => {
        try {
            const response = await axiosInstance.put(`/inbox/updateinbox/${id}`, userInput);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const isread = createAsyncThunk(
    'isread/slice',
    async ({ id, userInput }) => {
        try {
            const response = await axiosInstance.put(`/inbox/isread/${id}`, userInput);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);

export const deleteInboxById = createAsyncThunk(
    'deleteInboxById/slice',
    async ({ id, userInput }) => {
        try {
        
            
            const response = await axiosInstance.delete(`/inbox/deleteinbox/${id}`, {
                data: userInput,
            });
            
            
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);

const initialState = {
    loading: false,
    msg: '',
    error: '',
    inboxes: [],
    studentInboxes:[],
    teacherInboxes:[]
    // teachersem: [],
    // sembyid: []
}
const InboxSlice = createSlice(
    {
        name: 'inbox',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getInbox.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getInbox.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(getInbox.fulfilled, (state, { payload }) => {

                state.loading = false
                state.inboxes = payload?.body
                
                

            })
            builder.addCase(getInboxByStudentid.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getInboxByStudentid.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(getInboxByStudentid.fulfilled, (state, { payload }) => {

                state.loading = false
                state.studentInboxes = payload?.body
                
                

            })
            builder.addCase(inboxByTeacherId.pending, (state) => {
                state.loading = true
            })
            builder.addCase(inboxByTeacherId.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(inboxByTeacherId.fulfilled, (state, { payload }) => {

                state.loading = false
                state.teacherInboxes = payload?.body
                
                

            })
            
         
            builder.addCase(addInbox.pending, (state) => {
                state.loading = true
            })
            builder.addCase(addInbox.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(addInbox.fulfilled, (state, { payload }) => {

                state.loading = false


            })
            builder.addCase(updateInbox.pending, (state) => {
                state.loading = true
            })
            builder.addCase(updateInbox.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(updateInbox.fulfilled, (state, { payload }) => {

                state.loading = false


            })
            builder.addCase(isread.pending, (state) => {
                state.loading = true
            })
            builder.addCase(isread.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(isread.fulfilled, (state, { payload }) => {

                state.loading = false


            })
            builder.addCase(deleteInboxById.pending, (state) => {
                state.loading = true
            })
            builder.addCase(deleteInboxById.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(deleteInboxById.fulfilled, (state, { payload }) => {

                state.loading = false


            })
        }
    }
)
export default InboxSlice.reducer