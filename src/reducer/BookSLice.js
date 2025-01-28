import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./Api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";


export const getallbooks = createAsyncThunk(
  'allbooks/slice',
  async () => {
    try {
      const response = await axiosInstance.get("/book/allbooks");   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const booksbySubId = createAsyncThunk(
  'booksbySubId/slice',
  async (id) => {
    try {
      // console.log(id);
      
      // const navigate = useNavigate()
      // if(!id){
      //   notification.error({message:"Try again later"})
      //   navigate("/user/subject")
      // }
      const response = await axiosInstance.get(`/book/booksbySubId/${id}`);   
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const updateBook = createAsyncThunk(
  'updateBook/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.put(`/book/updateBook/${id}`, userInput);
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const deleteBook = createAsyncThunk(
  'deleteBook/slice',
  async ({id,userInput}) => {
    try {
      const response = await axiosInstance.delete(`/book/deleteBook/${id}`, {
        data: userInput,
      });
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const addbook = createAsyncThunk(
  'addbook/slice',
  async (userInput) => {
    try {
      const response = await axiosInstance.post("/book/addbook", userInput);
      
      return response?.data;
    } catch (error) {
      notification.error({message:error.response.data.message})
    }
  }
);
export const downloadPdf = createAsyncThunk(
  'book/downloadPdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/book/downloadpdf/${id}`, {
        responseType: 'arraybuffer', // To handle binary data
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'books_document.pdf'; // Filename for the downloaded file
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
  'book/uploadPdf',
  async ({ id, role, file }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post(`/book/uploadpdf/${id}/${role}`, formData, {
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
    books:[],
    subbooks:[],
    uploadMessage: null,
}

const BookSlice= createSlice(
    {
        name:"books",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getallbooks.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(getallbooks.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.books=payload?.body

            })
            builder.addCase(getallbooks.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(booksbySubId.pending,(state)=>{
                state.loading=true
            })
            builder.addCase(booksbySubId.fulfilled,(state,{payload})=>{
                
                state.loading=false
                
                state.subbooks=payload?.body

            })
            builder.addCase(booksbySubId.rejected,(state)=>{
                state.loading=false
                state.error="something went wrong"

            })
            builder.addCase(addbook.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(addbook.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
            //   state.b=payload?.body

          })
          builder.addCase(addbook.rejected,(state)=>{
              state.loading=false
              state.error="something went wrong"

          })
            builder.addCase(updateBook.pending,(state)=>{
              state.loading=true
          })
          builder.addCase(updateBook.fulfilled,(state,{payload})=>{
              
              state.loading=false
              
            //   state.notes=payload?.body

          })
          builder.addCase(updateBook.rejected,(state)=>{
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


export default BookSlice.reducer;
