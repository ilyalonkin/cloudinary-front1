import React, { useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";
import { useDispatch } from "react-redux";
import { getTagPosts } from "../Redux/slices/posts";

export const TagsBlock = ({ tags, isLoading = true }) => {
  const dispatch = useDispatch();

  const getPosts = (text) => {
    const name = {
      name: text,
    };
    dispatch(getTagPosts(name));
  };

  const tagsArray = [];

  for (let tag of tags) {
    if (tag !== "") {
      tagsArray.push(tag);
    }
  }

  const tagsReduce = tagsArray.slice(0, 5);

  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : tagsReduce).map((name, index) => (
          <a key={index} style={{ textDecoration: "none", color: "black" }}>
            <ListItem key={index} disablePadding onClick={() => getPosts(name)}>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </a>
        ))}
      </List>
    </SideBlock>
  );
};
