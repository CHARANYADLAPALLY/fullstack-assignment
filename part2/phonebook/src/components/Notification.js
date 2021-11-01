import React from "react";

const Notification = ({ message, type }) => {
  const successNotification = {
    background: "#DFF2BF",
    color: "#4F8A10",
    margin: "10px 0px",
    padding: "12px",
  };

  const updateNotification = {
    background: "#BDE5F8",
    color: "#00529B",
    margin: "10px 0px",
    padding: "12px",
  };

  const errorNotification = {
    background: "#FFD2D2",
    color: "#D8000C",
    margin: "10px 0px",
    padding: "12px",
  };

  const notificationStyle =
    message === null
      ? null
      : type === "ok"
      ? successNotification
      : type === "update"
      ? updateNotification
      : errorNotification;

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
