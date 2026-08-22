// import React from 'react'
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const notesContext = createContext();

const NotesContextProvider = (props) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const backendurl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");

  const setToken = (value) => {
    const nextToken = typeof value === "function" ? value(token) : value;
    if (nextToken) {
      localStorage.setItem("token", nextToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
    setTokenState(nextToken || "");
  };

  const getNotes = useCallback(async (id) => {
    const authToken = token || localStorage.getItem("token") || "";

    if (!id) {
      toast.error("User ID is required to load notes.");
      return [];
    }

    if (!authToken) {
      toast.error("Please log in again to view notes.");
      return [];
    }

    try {
      const response = await axios.get(`${backendurl}/api/notes/get-notes`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data.notes || [];
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return [];
    }
  }, [backendurl, token]);

  useEffect(() => {
    const syncToken = () => {
      const storedToken = localStorage.getItem("token") || "";
      if (storedToken !== token) {
        setTokenState(storedToken);
      }
      if (!storedToken) {
        localStorage.removeItem("userId");
      }
    };

    syncToken();
    window.addEventListener("storage", syncToken);

    return () => window.removeEventListener("storage", syncToken);
  }, [token]);

  const values = {
    navigate,
    backendurl,
    setToken,
    token,
    getNotes,
    isAuthenticated: Boolean(token),
  };

  return <notesContext.Provider value={values}>{props.children}</notesContext.Provider>;
};

export default NotesContextProvider;
