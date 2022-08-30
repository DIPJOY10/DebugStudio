import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Client from "../components/Client";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Editor from "../components/Editor";
import { useEffect } from "react";
import ACTIONS from "../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { initSocket } from "../socket";
import toast from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // background: "black",
    background: "#f8f9fa",
  },
  users_panel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: "0.2",
    position: "relative",
    borderRight: "1px solid grey",
  },
  editor_panel: {
    flex: "0.5",
    borderRight: "1px solid grey",
  },
  problem_panel: {
    flex: "0.3",
  },
  logoImage: {
    height: "50%",
  },
  clientsList: {
    display: "flex",
    flexWrap: "wrap",
  },
  users_panel_top: {
    marginLeft: "1rem",
  },
  users_panel_bottom: {
    display: "flex",
    flexDirection: "column",
    padding: "3rem",
  },
  btn: {
    color: "white",
    background: "#3bd322",
    fontWeight: "bold",
    transition: "0.3s all ease-in-out",
    "&:hover": {
      color: "#3bd322",
      background: "white",
    },
    width: "100%",
    marginBottom: "1rem",
  },
  leaveBtn: {
    color: "white",
    background: "red",
    "&:hover": {
      color: "red",
      background: "white",
    },
  },
  appbar: {
    background: "black",
    borderBottom: "1px solid grey",
  },
  logoImage: {
    height: "10vh",
    width: "auto",
  },
  editor_panel_header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: "1rem",
    marginTop: "1rem",
  },
  select_form: {
    width: "30%",
  },
  editor_container: {
    flexGrow: "1",
  },
}));

const Room = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName,
      });

      //listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, userName, socketId }) => {
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room.`);
            console.log(`${userName} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const classes = useStyles();

  const {
    root,
    users_panel,
    users_panel_top,
    users_panel_bottom,
    editor_panel,
    problem_panel,
    logoImage,
    clientsList,
    btn,
    leaveBtn,
    appbar,
    editor_panel_header,
    editor_container,
    select_form,
  } = classes;

  const languageToEditorMode = {
    c: "c_cpp",
    cpp: "c_cpp",
    python: "python",
    python3: "python",
    java: "java",
    javascript: "javascript",
    kotlin: "kotlin",
    rust: "rust",
  };

  const languages = Object.keys(languageToEditorMode);
  const themes = [
    "monokai",
    "github",
    "solarized_dark",
    "dracula",
    "eclipse",
    "tomorrow_night",
    "tomorrow_night_blue",
    "xcode",
    "ambiance",
    "solarized_light",
  ].sort();
  const fontSizes = [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "30",
    "32",
  ];

  const [language, setLanguage] = useState("c");
  const [theme, setTheme] = useState("monokai");
  // const [body, setBody] = useState("");
  const [fontSize, setFontsize] = useState("20");

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied to your clipboard");
    } catch (error) {
      toast.error("Could not copy room ID");
      console.log(error);
    }
  };

  const onLeaveRoom = () => {
    reactNavigator("/");
  };

  return (
    <>
      <AppBar className={appbar} position="sticky">
        <Toolbar>
          <img className={logoImage} src="/debug-studio-img.png" alt="logo" />
        </Toolbar>
      </AppBar>
      <div className={root}>
        <div className={users_panel}>
          <div className={users_panel_top}>
            <div className={clientsList}>
              {clients.map((client, index) => (
                <Client key={index} userName={client.userName} />
              ))}
            </div>
          </div>
          <div className={users_panel_bottom}>
            <Button className={btn} onClick={copyRoomId} variant="contained">
              COPY ROOM ID
            </Button>
            <Button
              onClick={onLeaveRoom}
              className={`${btn} ${leaveBtn}`}
              variant="contained"
            >
              LEAVE
            </Button>
          </div>
        </div>
        <div className={editor_panel}>
          <div className={editor_panel_header}>
            <FormControl className={select_form} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Language
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Language"
              >
                {languages.map((lang, index) => {
                  return (
                    <MenuItem key={index} value={lang}>
                      {lang}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className={select_form} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Font size
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={fontSize}
                onChange={(e) => setFontsize(e.target.value)}
                label="Font size"
              >
                {fontSizes.map((font, index) => {
                  return (
                    <MenuItem key={index} value={font}>
                      {font}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className={select_form} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Theme
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                label="Font size"
              >
                {themes.map((theme, index) => {
                  return (
                    <MenuItem key={index} value={theme}>
                      {theme}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className={editor_container}>
            <Editor
              socketRef={socketRef}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
              roomId={roomId}
              fontSize={fontSize}
              language={languageToEditorMode[language]}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
