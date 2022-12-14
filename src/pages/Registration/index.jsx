import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuthMe,
  fetchRegister,
  selectIsAuth,
} from "../../Redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import axios from "../../axios";

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [avatarURL, setAvatarURL] = useState("");
  const inputFileRef = useRef(null);

  // const handleChangeFile = async (event) => {
  //   try {
  //     const formData = new FormData();
  //     const file = event.target.files[0];
  //     formData.append("image", file);
  //     const { data } = await axios.post("/upload", formData);
  //     setAvatarURL(`process.env.REACT_APP_API_URL${data.url}`);
  //   } catch (err) {
  //     console.warn(err);
  //     alert("Ошибка при загрузке файла");
  //   }
  // };

  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}api/upload`, {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json())
        .then(async (data) => {
          await setAvatarURL(data.url);
        });
    } catch (err) {
      console.warn(err);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setAvatarURL("");
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const fullValues = { ...values, avatarURL };
    const data = await dispatch(fetchRegister(fullValues));

    if (!data.payload) {
      return alert("Не удалось зарегистрироваться");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={avatarURL || "/noavatar.png"}
            onClick={() => inputFileRef.current.click()}
          />
          {avatarURL ? (
            <span
              onClick={onClickRemoveImage}
              style={{ color: "gray", cursor: "pointer" }}
            >
              &times;
            </span>
          ) : (
            <></>
          )}
          <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
          />
        </div>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Укажите полное имя" })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type={"email"}
          {...register("email", { required: "Укажите почту" })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type={"password"}
          {...register("password", { required: "Укажите пароль" })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type={"submit"}
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
