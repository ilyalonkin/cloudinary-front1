import React from "react";
import styles from "./SideBlock.module.scss";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export const SideBlock = ({ full, title, children }) => {
  return (
    <Paper classes={full ? { root: styles.rootFull } : { root: styles.root }}>
      <Typography
        variant="h6"
        classes={full ? { root: styles.titleFull } : { root: styles.title }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
