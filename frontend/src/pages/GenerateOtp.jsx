import  { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { notesContext } from "../context/NotesContext";

const GenerateOTP = () => {
  const [email, setEmail] = useState("");
  const { navigate, backendurl } = useContext(notesContext);
  const location = useLocation();

  useEffect(() => {
    const authEmail = location.state?.email;

    if (authEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(authEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendurl + "/api/user/generate-otp", {
        email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-otp", { state: { email, name: location.state.name } });
      } else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Unable to generate OTP. Check the backend deployment and email configuration.",
      );
    }
  };
  return (
    <div className="max-w-100 m-auto p-5 rounded-sm shadow-lg flex flex-col items-center justify-center border border-[#ccc]">
      <h2 className="text-3xl font-bold ">Generate OTP</h2>
      <form
        className="flex flex-col justify-center items-center gap-2  w-75 m-12.5 p-5 border border-[#ccc] rounded-sm "
        onSubmit={handleSubmit}
      >
        <label className="font-bold text-2xl text-black">Email</label>
        <input
          className="w-full p-2.5 m-2.5 border border-[#ccc] rounded-sm"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="w-full p-2.5 bg-[#322F30] text-white border-0 rounded-sm cursor-pointer hover:bg-[#322F30]/90 transition-colors duration-300"
          type="submit"
        >
          Generate OTP
        </button>
      </form>
    </div>
  );
};

export default GenerateOTP;
