import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import toast from "react-hot-toast";
import { v4 as IDGenerator } from "uuid";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    "& .MuiFormLabel-root": {
      color: "white",
      fontSize: "1.1rem",
    },
    background: "black",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  formWrapper: {
    border: "2px solid white",
    width: "fit-content",
    padding: "1rem",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    margin: "auto",
    paddingTop: "1rem",
    "& $TextField": {
      paddingTop: "0.5rem",
    },
  },
  textFieldInput: {
    fontColor: "white",
    backgroundColor: "#3bd322",
    marginBottom: "1rem",
    border: "2px solid white",
    borderRadius: "3px",
  },
  btnGrp: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0 2.8rem",
  },
  btn: {
    fontWeight: "bold",
    fontSize: "1rem",
    backgroundColor: "#3bd322",
    color: "white",
    padding: "0.5rem 1.5rem",
    transition: "0.3s ease-in-out",
    "&:hover": {
      color: "#3bd322",
      backgroundColor: "white",
    },
  },
  formFooter: {
    color: "#3bd322",
  },
  createLink: {
    display: "inline-block",
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
    transition: "0.3s ease-in-out",
    "&:hover": {
      color: "#3bd322",
      transform: "scale(1.03)",
      transition: "transform 0.3s ease-in-out",
    },
  },
  input: {
    color: "white",
  },
});

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const {
    root,
    logo,
    inputs,
    formWrapper,
    textFieldInput,
    btn,
    btnGrp,
    formFooter,
    createLink,
  } = classes;

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = IDGenerator();
    // console.log(id);
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Both Room ID & Username are required");
      return;
    }

    //Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };

  const handleInputEnter = (e) => {
    console.log("event", e);
    if (e.keyCode === 13) {
      joinRoom();
    }
  };

  return (
    <div className={root}>
      <div className={formWrapper}>
        <div className={logo}>
          <img src="/debug-studio-img.png" alt="debug studio Pic" />
        </div>
        <div className={inputs}>
          <TextField
            autoComplete="off"
            inputProps={{ className: classes.input }}
            className={textFieldInput}
            label="Room ID"
            variant="filled"
            InputProps={{
              disableUnderline: true,
            }}
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            onKeyDown={handleInputEnter}
          />
          <TextField
            autoComplete="off"
            inputProps={{ className: classes.input }}
            className={textFieldInput}
            label="Username"
            variant="filled"
            InputProps={{
              disableUnderline: true,
            }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            onKeyDown={handleInputEnter}
          />
        </div>
        <div className={btnGrp}>
          <p className={formFooter}>
            No Invite? Create a &nbsp;
            <a href="/" onClick={createNewRoom} className={createLink}>
              new room
            </a>
          </p>
          <Button onClick={joinRoom} className={btn} variant="contained">
            JOIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
