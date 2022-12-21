import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { useDispatch, useSelector } from "react-redux";
import {fetchPosts, fetchRemovePost, getTagPosts} from "../../Redux/slices/posts";
import { selectIsAuth } from "../../Redux/slices/auth";
import { getLastComments } from "../../Redux/slices/commentSlice";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  if (isLoading) {
    return <PostSkeleton />;
  }

  const getPosts = (text) => {
    navigate("/");
    const name = {
      name: text.trim(),
    };
    dispatch(getTagPosts(name));
  };

  const onClickRemove = async () => {
    if (window.confirm("Вы действительно хотите удалить статью?")) {
      await dispatch(fetchRemovePost(id));
      await dispatch(getLastComments());
      await dispatch(fetchPosts(1));
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && isAuth ? (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      ) : (
        <></>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
          style={isFullPost ? { cursor: "default" }: { cursor: "pointer" }}
          onClick={() => {navigate(`/posts/${id}`)}}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) =>
              !name ? (
                <></>
              ) : (
                <li key={name}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => getPosts(name)}
                  >
                    #{name}
                  </span>
                </li>
              )
            )}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
