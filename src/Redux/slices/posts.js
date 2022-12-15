import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("fetchPosts", async (page) => {
  const { data } = await axios.get(`/posts`);
  return data;
});

export const getPopular = createAsyncThunk("getPopular", async () => {
  const { data } = await axios.get("/posts/popular");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "fetchRemovePost",
  async (id) => {
    axios.delete(`/posts/${id}`);
  }
);

export const getTagPosts = createAsyncThunk("getTagPosts", async (name) => {
  const { data } = await axios.post(`/posts/tags`, name);
  return data;
});

const PostsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: {
      items: [],
      status: "loading",
    },
  },
  reducers: {},
  extraReducers: {
    //Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      for (let key of state.posts.items) {
        key.createdAt.toLocaleDateString("en-US");
      }
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Получение популярных статей
    [getPopular.pending]: (state) => {
      state.posts.status = "loading";
    },
    [getPopular.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [getPopular.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Получение статей для тега
    [getTagPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [getTagPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [getTagPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const PostsReducer = PostsSlice.reducer;
