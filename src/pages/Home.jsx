import React, { useEffect, useRef, useState } from "react";
import preloader from "../assets/img/preloader.svg";
import "./Home.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, getPopular } from "../Redux/slices/posts";
import { fetchTags } from "../Redux/slices/tags";
import { getLastComments } from "../Redux/slices/commentSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const { tags } = useSelector((state) => state.tags);
  const { comments } = useSelector((state) => state.comments);

  const [valueTab, setValueTab] = useState(0);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(4);
  const [fetching, setFetching] = useState(true);
  const [postItems, setPostsItems] = useState([]);

  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  //Первое монтирование компоненты
  useEffect(() => {
    dispatch(fetchPosts(1));
    dispatch(fetchTags());
    dispatch(getLastComments());
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  //Загрузка первых двух постов после полного получения данных
  useEffect(() => {
    setPostsItems([...posts.items.slice(0, 4)]);
    setStartIndex(4);
    setEndIndex(6);
  }, [isPostLoading]);

  //Пересоздание массива с постами с добавлением новых элементов
  useEffect(() => {
    if (fetching) {
      setStartIndex((prev) => prev + 2);
      setEndIndex((prev) => prev + 2);
      setPostsItems([...postItems, ...posts.items.slice(startIndex, endIndex)]);
    }

    setFetching(false);
  }, [fetching]);

  //Отслеживание низа страницы и пересоздание массива с новыми постами
  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100
    )
      setFetching(true);
  };

  const getNewPosts = () => {
    setValueTab(0);
    setStartIndex(4);
    setEndIndex(6);
    dispatch(fetchPosts(1));
  };

  const getPopularPosts = async () => {
    setValueTab(1);
    setStartIndex(4);
    setEndIndex(6);
    dispatch(getPopular());
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={valueTab}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={getNewPosts} />
        <Tab label="Популярные" onClick={getPopularPosts} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={12} sm={12} md={9} item>
          {isPostLoading ? (
            <div className={"preloader"}>
              <img
                className={"imgLoader"}
                src={preloader}
                alt="Получаем посты.."
              />
            </div>
          ) : (
            postItems.map((obj) => (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? obj.imageUrl : ""}
                user={obj.author}
                createdAt={() => {
                  console.log(obj.createdAt);
                }}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.author._id}
              />
            ))
          )}
        </Grid>

        <Grid xs={0} sm={0} md={3} item>
          <TagsBlock tags={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={comments.items} isLoading={false} home={true} />
        </Grid>
      </Grid>
    </>
  );
};
