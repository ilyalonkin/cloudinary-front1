import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import preloader from "../assets/img/preloader.svg";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../Redux/slices/commentSlice";

export const FullPost = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const { comments } = useSelector((state) => state.comments);
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        // setData(...res.data, createdAt: data.createdAt.toISOString().substring(0, 10))
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
    dispatch(getComments(id));
  }, []);

  if (isLoading) {
    return (
      <div className={"preloader"}>
        <img className={"imgLoader"} src={preloader} alt="Загружаем пост.." />
      </div>
    );
  } else {
    return (
      <>
        <Post
          key={data._id}
          id={data._id}
          title={data.title}
          imageUrl={data.imageUrl ? data.imageUrl : ""}
          user={data.author}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={data.commentsCount}
          tags={data.tags}
          isFullPost
          isEditable={userData?._id === data.author._id}
        >
          {<ReactMarkdown children={data.text} />}
        </Post>
        <CommentsBlock items={comments.items} isLoading={isLoading} full={true}>
          <Index id={id} />
        </CommentsBlock>
      </>
    );
  }
};
