import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-kotlin";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-solarized_light";
import ace from "react-ace";
import ACTIONS from "../Actions";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    // width: "100%",
    // height: "100%",
  },
});

const Editor = ({
  socketRef,
  language,
  theme,
  fontSize,
  roomId,
  onCodeChange,
}) => {
  const classes = useStyles();
  const editorRef = useRef(null);
  const [body, setBody] = useState("");

  const { root } = classes;

  const onChange = (newValue) => {
    console.log(newValue);
    onCodeChange(newValue);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newValue,
    });
  };

  useEffect(() => {
    if (socketRef?.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        setBody(code);
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef?.current]);

  return (
    <AceEditor
      ref={editorRef}
      mode={language}
      theme={theme}
      value={body}
      name="UNIQUE_ID_OF_DIV"
      onChange={onChange}
      showGutter={true}
      width="100%"
      height="80vh"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
      fontSize={fontSize ? (isNaN(+fontSize) ? 12 : +fontSize) : 12}
    />
  );
};

export default Editor;
