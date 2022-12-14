import React, {useState} from "react";

import styles from "./AddComment.module.scss";

import TextField                  from "@mui/material/TextField";
import Avatar                     from "@mui/material/Avatar";
import Button                     from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth}             from "../../Redux/slices/auth";
import ListItemText               from "@mui/material/ListItemText";
import ListItem                   from "@mui/material/ListItem";
import axios                      from "../../axios";
import {getComments}              from "../../Redux/slices/commentSlice";


export const Index = ({id}) => {
    const isAuth = useSelector(selectIsAuth);
    const avatar = useSelector(state => state.auth.data);
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    if (isAuth) {
        const fields = {
            post: id,
            author: avatar,
            text: text,
        };

        const addComment = async () => {
            if (isAuth) {
                await axios.post(`/comments/${ id }`, fields);
                dispatch(getComments(id));
                setText('');
            }
        };

        return (
            <>
                <div className={ styles.root }>
                    <Avatar
                        classes={ {root: styles.avatar} }
                        src={ avatar.avatarURL }
                    />
                    <div className={ styles.form }>
                        <TextField
                            label="Написать комментарий"
                            variant="outlined"
                            maxRows={ 10 }
                            multiline
                            fullWidth
                            value={ text }
                            onChange={ e => setText(e.target.value) }
                        />
                        <Button onClick={ addComment } variant="contained">Отправить</Button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <ListItem>
                <ListItemText
                    secondary={ 'Оставлять комментарии могут только авторизованные пользователи' }
                />
            </ListItem>
        )
    }
};