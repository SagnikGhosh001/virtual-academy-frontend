// InternetStatus.js
import React, { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";

function InternetStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Your internet connection is off");

  const handleOnline = () => {
    setIsOnline(true);
    setMessage("Your internet connection is back online");
    setOpen(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
    setMessage("Your internet connection is off");
    setOpen(true);
  };

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Snackbar
      open={open}
      message={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={3000}
      onClose={() => setOpen(false)} 
    />
  );
}

export default InternetStatus;
