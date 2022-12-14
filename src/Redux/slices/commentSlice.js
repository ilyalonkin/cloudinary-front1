import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios                           from "../../axios";

export const getAllComments = createAsyncThunk('getAllComments', async () => {
    const {data} = await axios.get(`/comments/all`);
    return data;
});

export const getComments = createAsyncThunk('getComments', async (id) => {
    const {data} = await axios.get(`/comments/${ id }`);
    return data;
});

export const getLastComments = createAsyncThunk('getLastComments', async () => {
    const {data} = await axios.get('/comments');
    return data
});

export const removeComment = createAsyncThunk('removeComment', async (id) => {
    await axios.delete(`/comments/${ id }`);
});

const initialState = {
    comments: {
        items: [],
        status: '',
    }
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        //Получение всех комментариев
        [getAllComments.pending]: (state) => {
            state.comments.status = 'loading';
        },
        [getAllComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded';
        },
        [getAllComments.rejected]: (state) => {
            state.comments.status = 'error';
            state.comments.items = [];
        },
        //Получение последних комментариев
        [getLastComments.pending]: (state) => {
            state.comments.status = 'loading';
        },
        [getLastComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded';
        },
        [getLastComments.rejected]: (state) => {
            state.comments.status = 'error';
            state.comments.items = [];
        },
        //Получение комментариев к конкретному посту
        [getComments.pending]: (state) => {
            state.comments.status = 'loading';
        },
        [getComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded';
        },
        [getComments.rejected]: (state) => {
            state.comments.status = 'error';
            state.comments.items = [];
        },
        //Удаление комментария
        [removeComment.pending]: (state, action) => {
            state.comments.items = state.comments.items.filter(
                (obj) => obj._id !== action.meta.arg
            );
        },
    }
});

export const CommentsReducer = commentSlice.reducer;