import React from "react";
import Avatar from "react-avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  client: {
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    flexDirection: "column",
    margin: "1rem",
  },
  span_username: {
    marginTop: "0.5rem",
  },
  avatar: {
    border: "3px solid black",
    borderRadius: "100%",
  },
});

const Client = ({ userName }) => {
  const classes = useStyles();
  const { client, span_username, avatar } = classes;
  return (
    <div className={client}>
      <Avatar className={avatar} name={userName} size={60} />
      <span className={span_username}>{userName}</span>
    </div>
  );
};

export default Client;
