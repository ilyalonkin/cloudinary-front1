import {configureStore}  from "@reduxjs/toolkit";
import {PostsReducer}    from "./slices/posts";
import {AuthReducer}     from "./slices/auth";
import {CommentsReducer} from "./slices/commentSlice";
import {TagsReducer}     from "./slices/tags";

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        posts: PostsReducer,
        tags: TagsReducer,
        comments: CommentsReducer,
    },
});

export default store;
