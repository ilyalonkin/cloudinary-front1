import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { removeComment } from "../Redux/slices/commentSlice";
import { selectIsAuth } from "../Redux/slices/auth";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  home = false,
  full = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts } = useSelector((state) => state.posts);
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const deleteComment = (id) => {
    dispatch(removeComment(id));
  };

  let Comments = items;

  const getIdPost = (id) => {
    if (home) {
      const searchId = {
        search: id,
      };
      axios
        .post(`/comments`, searchId)
        .then((res) => {
          navigate(`/posts/${res.data}`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <SideBlock title="Комментарии" full={full}>
      <List>
        {(isLoading ? [...Array(5)] : Comments).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem
              alignItems="flex-start"
              style={{ cursor: "pointer" }}
              onClick={() => getIdPost(obj._id)}
            >
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={obj.author.fullName}
                    src={obj.author.avatarURL}
                  />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.author.fullName}
                  secondary={obj.text}
                />
              )}
              {isAuth && userData?._id === obj.author._id && !home ? (
                <span
                  onClick={() => deleteComment(obj._id)}
                  style={{ color: "gray", cursor: "pointer" }}
                >
                  &times;
                </span>
              ) : (
                <></>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
