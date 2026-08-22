import axios from "axios";
// import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { notesContext } from "../context/NotesContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const { navigate, backendurl, setToken } = useContext(notesContext);
  const location = useLocation();
  let email = location.state?.email;
  let name = location.state?.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendurl + "/api/user/verify-otp", {
        email,
        otp:otp.trim(),
      });
      if (response.data.success) {
        toast.success(response.data.message);

        const token = response.data.token;
        const userId = response.data.userId;

        if (token) {
          setToken(token);
          localStorage.setItem("token", token);
        }
        if (userId) {
          localStorage.setItem("userId", userId);
        }
        if (email) {
          localStorage.setItem("email", email);
        }
        if(name){
          localStorage.setItem("name", name);
        }

        navigate("/notes");
      } else {
        toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-100 m-auto p-5 rounded-sm shadow-lg flex flex-col items-center justify-center border border-[#ccc]">
      <h2 className="text-3xl font-bold ">Verify OTP</h2>
      <form
        className="flex flex-col justify-center items-center gap-2  w-75 m-12.5 p-5 border border-[#ccc] rounded-sm "
        onSubmit={handleSubmit}
      >
        <label className="font-bold text-2xl text-black">OTP: </label>
        <input
          className="w-full p-2.5 m-2.5 border border-[#ccc] rounded-sm"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button
          className="w-full p-2.5 bg-[#322F30] text-white border-0 rounded-sm cursor-pointer hover:bg-[#322F30]/90 transition-colors duration-300"
          type="submit"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
