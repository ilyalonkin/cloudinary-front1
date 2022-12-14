import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, logout, selectIsAuth } from "../../Redux/slices/auth";
import Avatar from "@mui/material/Avatar";
import axios from "../../axios";
import { fetchPosts } from "../../Redux/slices/posts";

export const Header = () => {
  const [menuActive, setMenuActive] = useState(true);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const inputFileRef = useRef(null);

  const rerenderHome = () => {
    dispatch(fetchPosts(1));
  };

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json())
        .then(async (data) => {
          let avatarURL = data.url;

          const fields = {
            id: userData._id,
            avatar: avatarURL,
          };
          await axios.patch("/auth/update", fields);

          dispatch(fetchAuthMe());
        });
    } catch (err) {
      console.warn(err);
      alert("Ошибка при загрузке файла");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div className={styles.box}>
            <NavLink className={styles.logo} to="/">
              <span className={styles.logo1} onClick={rerenderHome}>
                BULOCHKA BLOG
              </span>
            </NavLink>
            <span
              className={styles.menu1}
              onClick={() => setMenuActive(!menuActive)}
            >
              &equiv;
            </span>
          </div>

          <div className={menuActive ? styles.buttons : styles.buttonsActive}>
            {isAuth ? (
              <div className={styles.userInfo}>
                <div className={styles.avatarInfo}>
                  <Avatar
                    data-name={"Суматранский тигр"}
                    style={{ cursor: "pointer" }}
                    alt={userData.fullName}
                    src={userData.avatarURL}
                    onClick={() => inputFileRef.current.click()}
                  />
                  <input
                    ref={inputFileRef}
                    type="file"
                    onChange={handleFileInputChange}
                    // onChange={handleChangeFile}
                    hidden
                  />
                </div>
                <span>{userData.fullName}</span>
                <NavLink to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </NavLink>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="outlined">Войти</Button>
                </NavLink>
                <NavLink to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
