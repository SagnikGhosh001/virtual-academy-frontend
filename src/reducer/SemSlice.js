import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";

export const getAllSem = createAsyncThunk(
    'sem/slice',
    async () => {
        const response = await axiosInstance.get("/sem/allsem")
        return response?.data
    }
)
export const getAllSemByTeacherId = createAsyncThunk(
    'semByTeacherId/slice',
    async (id) => {
        const response = await axiosInstance.get(`/sem/allsembyteacherID/${id}`)
        // console.log(response?.data?.body);

        return response?.data?.body
    }
)
export const getAllSemById = createAsyncThunk(
    'allsembyid/slice',
    async (id) => {
        const response = await axiosInstance.get(`/sem/allsembyid/${id}`)
        // console.log(response?.data?.body);

        return response?.data?.body
    }
)
export const addsem = createAsyncThunk(
    'addsem/slice',
    async (userInput) => {
        try {
            console.log(userInput, 'userInput');
            const response = await axiosInstance.post("/sem/addSem", userInput);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);
export const updateSem = createAsyncThunk(
    'updateSem/slice',
    async ({ id, userInput }) => {
        try {
            const response = await axiosInstance.put(`/sem/updateSemName/${id}`, userInput);
            return response?.data;
        } catch (error) {
            notification.error({ message: error.response.data.message })
        }
    }
);

export const deletesem = createAsyncThunk(
    'deleteSemyId/slice',
    async ({ id, userInput }) => {
        try {
            const response = await axiosInstance.delete(`/sem/deletesem/${id}`, {
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
    sem: [],
    teachersem: [],
    sembyid: []
}

const SemSlice = createSlice(
    {
        name: 'sem',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(getAllSem.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getAllSem.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(getAllSem.fulfilled, (state, { payload }) => {

                state.loading = false
                state.sem = payload

            })
            builder.addCase(getAllSemByTeacherId.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getAllSemByTeacherId.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(getAllSemByTeacherId.fulfilled, (state, { payload }) => {

                state.loading = false
                state.teachersem = payload

            })
            builder.addCase(getAllSemById.pending, (state) => {
                state.loading = true
            })
            builder.addCase(getAllSemById.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(getAllSemById.fulfilled, (state, { payload }) => {

                state.loading = false
                state.sembyid = payload

            })
            builder.addCase(addsem.pending, (state) => {
                state.loading = true
            })
            builder.addCase(addsem.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(addsem.fulfilled, (state, { payload }) => {

                state.loading = false


            })
            builder.addCase(updateSem.pending, (state) => {
                state.loading = true
            })
            builder.addCase(updateSem.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(updateSem.fulfilled, (state, { payload }) => {

                state.loading = false


            })
            builder.addCase(deletesem.pending, (state) => {
                state.loading = true
            })
            builder.addCase(deletesem.rejected, (state) => {
                state.loading = false
                state.error = "some error ocuure"

            })
            builder.addCase(deletesem.fulfilled, (state, { payload }) => {

                state.loading = false


            })
        }
    }
)

export default SemSlice.reducer