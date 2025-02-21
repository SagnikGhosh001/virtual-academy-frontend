import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallrooms = createAsyncThunk(
    'allroom/slice',
    async () => {
        try {
            const response = await axiosInstance.get("/room/allroom");
            return response?.data;
        } catch (error) {
            
            notification.error({ message: error.response.data.message })
        }
    }
);
export const roombyId = createAsyncThunk(
    'roomsbyId/slice',
    async (id) => {
        try {
            const response = await axiosInstance.get(`/room/roombyid/${id}`);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const roomcreatorId = createAsyncThunk(
    'roomcreatorId/slice',
    async (id) => {
        try {
            const response = await axiosInstance.get(`/room/roombycreatorid/${id}`);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const roomparticipentId = createAsyncThunk(
    'roomparticipentId/slice',
    async (id) => {
        try {
            const response = await axiosInstance.get(`/room/roombyparticipentsid/${id}`);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const roombyRoomId = createAsyncThunk(
    'roombyRoomId/slice',
    async (id) => {
        try {
            const response = await axiosInstance.get(`/room/roombyroomid/${id}`);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const editRoom = createAsyncThunk(
    'editRoom/slice',
    async ({ id, userInput }) => {
        try {
            const response = await axiosInstance.put(`/room/editRoom/${id}`, userInput);
            // console.log(response.data,'res');
            
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const deleteroombyid = createAsyncThunk(
    'deleteroombyid/slice',
    async ({ id, userInput }) => {
        try {
            const response = await axiosInstance.delete(`/room/deleteroombyid/${id}`, {
                data: userInput,
            });
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const createroom = createAsyncThunk(
    'createroom/slice',
    async (userInput) => {
        try {
            const response = await axiosInstance.post("/room/createroom", userInput);

            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const joinroom = createAsyncThunk(
    'joinroom/slice',
    async (userInput) => {
        try {
            const response = await axiosInstance.post("/room/joinroom", userInput);

            return response;
            
            
        } catch (error) {
            
            notification.error({ message: error.response.data.message })
        }
    }
);


const initialState = {
    loading: false,
    msg: "",
    error: "",
    rooms: [],
    roomsbyid: [],
    roomsbycreatorid: [],
    roomsbypartipentsid: [],
    roomsbyroomid: [],
    uploadMessage: null,
}

const RoomSLice = createSlice(
    {
        name: "rooms",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getallrooms.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getallrooms.fulfilled, (state, { payload }) => {

                state.loading = false

                state.rooms = payload?.body

            })
            builder.addCase(getallrooms.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(roombyId.pending, (state) => {
                state.loading = true
            })
            builder.addCase(roombyId.fulfilled, (state, { payload }) => {

                state.loading = false

                state.roomsbyid = payload?.body

            })
            builder.addCase(roombyId.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(roomcreatorId.pending, (state) => {
                state.loading = true
            })
            builder.addCase(roomcreatorId.fulfilled, (state, { payload }) => {

                state.loading = false

                state.roomsbycreatorid = payload?.body

            })
            builder.addCase(roomcreatorId.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(roomparticipentId.pending, (state) => {
                state.loading = true
            })
            builder.addCase(roomparticipentId.fulfilled, (state, { payload }) => {

                state.loading = false

                state.roomsbypartipentsid = payload?.body

            })
            builder.addCase(roomparticipentId.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(roombyRoomId.pending, (state) => {
                state.loading = true
            })
            builder.addCase(roombyRoomId.fulfilled, (state, { payload }) => {

                state.loading = false

                state.roomsbyroomid = payload?.body

            })
            builder.addCase(roombyRoomId.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(createroom.pending, (state) => {
                state.loading = true
            })
            builder.addCase(createroom.fulfilled, (state, { payload }) => {

                state.loading = false

                // state.notes=payload?.body

            })
            builder.addCase(createroom.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(joinroom.pending, (state) => {
                state.loading = true
            })
            builder.addCase(joinroom.fulfilled, (state, { payload }) => {

                state.loading = false

                // state.notes=payload?.body

            })
            builder.addCase(joinroom.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(editRoom.pending, (state) => {
                state.loading = true
            })
            builder.addCase(editRoom.fulfilled, (state, { payload }) => {

                state.loading = false

                // state.notes=payload?.body

            })
            builder.addCase(editRoom.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })
            builder.addCase(deleteroombyid.pending, (state) => {
                state.loading = true
            })
            builder.addCase(deleteroombyid.fulfilled, (state, { payload }) => {

                state.loading = false

                // state.notes=payload?.body

            })
            builder.addCase(deleteroombyid.rejected, (state) => {
                state.loading = false
                state.error = "something went wrong"

            })


        }
    }
)


export default RoomSLice.reducer;
