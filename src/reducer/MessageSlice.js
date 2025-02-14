import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallmessage = createAsyncThunk(
    'allroom/slice',
    async () => {
        try {
            const response = await axiosInstance.get("/message/allmessage");
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const messagebyid = createAsyncThunk(
    'messagebyid/slice',
    async (id) => {
        try {
            const response = await axiosInstance.get(`/message/messagebyid/${id}`);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const messagebyroomid = createAsyncThunk(
    'messagebyroomid/slice',
    async (id) => {
        try {
            
            const response = await axiosInstance.get(`/message/messagebyroomid/${id}`);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);



const initialState = {
    loading: false,
    msg: "",
    error: "",
    messages: [],
    messagebyid: [],
    messageroomid: [],
    uploadMessage: null,
}

const MessageSlice = createSlice(
    {
        name: "messages",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getallmessage.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getallmessage.fulfilled, (state, { payload }) => {

                state.loading = false

                state.messages = payload?.body

            })
            builder.addCase(getallmessage.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(messagebyid.pending, (state) => {
                state.loading = true
            })
            builder.addCase(messagebyid.fulfilled, (state, { payload }) => {

                state.loading = false

                state.messagebyid = payload?.body

            })
            builder.addCase(messagebyid.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(messagebyroomid.pending, (state) => {
                state.loading = true
            })
            builder.addCase(messagebyroomid.fulfilled, (state, { payload }) => {

                state.loading = false

                state.messageroomid = payload?.body

            })
            builder.addCase(messagebyroomid.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
        
        }
    }
)


export default MessageSlice.reducer;
