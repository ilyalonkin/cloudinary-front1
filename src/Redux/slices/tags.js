import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchTags = createAsyncThunk("fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

const TagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: {
      items: [],
      status: "loading",
    },
  },
  reducers: {},
  extraReducers: {
    //Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
  },
});

export const TagsReducer = TagsSlice.reducer;
