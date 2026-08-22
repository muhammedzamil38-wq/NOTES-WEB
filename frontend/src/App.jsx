import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { notesContext } from "./context/NotesContext";
import Navbar from "./components/Navbar";

const DisplayNotes = React.lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./pages/DisplayNotes")), 1000),
    ),
);
const Login = React.lazy(
  () =>
    new Promise((resolve) => setTimeout(() => resolve(import("./pages/Login")), 1000)),
);
const CompletedNotes = React.lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./pages/CompletedNotes")), 1000),
    ),
);
const GenerateOtp = React.lazy(
  () =>
    new Promise((resolve) => setTimeout(resolve(import("./pages/GenerateOtp")), 1000)),
);
const VerifyOtp = React.lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./pages/VerifyOtp")), 1000),
    ),
);
const AddNote = React.lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./components/AddNote")), 1000),
    ),
);
const Profile = React.lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./pages/Profile")), 1000),
    ),
);

const App = () => {
  const { token } = useContext(notesContext);

  return (
    <div className="min-h-screen w-full bg-[#FEEFCA] flex items-start justify-center pt-24 px-4">
      <ToastContainer />
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/notes" replace /> : <Navigate to="/login" replace />}
          />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={token ? <Navigate to="/notes" replace /> : <Login />} />
          <Route path="/notes" element={token ? <DisplayNotes /> : <Navigate to="/login" replace />} />
          <Route
            path="/completed-notes"
            element={token ? <CompletedNotes /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/add-notes"
            element={token ? <AddNote /> : <Navigate to="/login" replace />}
          />
          <Route path="/generate-otp" element={<GenerateOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="*" element={<Navigate to={token ? "/notes" : "/login"} replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
