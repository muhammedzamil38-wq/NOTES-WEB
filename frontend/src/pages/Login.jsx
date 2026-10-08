import  { useContext, useState } from "react";
import { notesContext } from "../context/NotesContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { navigate, backendurl } = useContext(notesContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateInputs = () => {
    const newErrors = { name: "", email: "", password: "" };
    if (currentState === "Sign Up") {
      if (!name.trim()) newErrors.name = "Name is required";
    }
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(email))
      newErrors.email = "Provide a valid email address";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendurl + "/api/user/register-user", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          navigate("/generate-otp", {
            state: {
              email,
              name,
              registrationToken: response.data.registrationToken,
            },
          });
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendurl + "/api/user/login-user", {
          email,
          password
        });
        if (response.data.success) {
          navigate("/generate-otp", {
            state: { email, name, loginToken: response.data.loginToken },
          });
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, 'hi');
    }
  };
  return (
    <form
      id="form"
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 "
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl ">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <input
        id="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Name"
      />
      <div className="text-red-600 text-[9px] h-3.25">{errors.name}</div>
      <input
        id="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
      />
      <div className="text-red-600 text-[9px] h-3.25">{errors.email}</div>

      <input
        id="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
      />
      <div className="text-red-600 text-[9px] h-3.25">{errors.password}</div>

      <div className="w-full flex justify-between text-sm mt-2">
        <p className="cursor-pointer">Forgot Your Password ?</p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create account
          </p>
        ) : (
          <p
            className="cursor-pointer"
            onClick={() => setCurrentState("Login")}
          >
            Login Here
          </p>
        )}
      </div>
      <button className="cursor-pointer bg-black text-white font-light px-8 py-2 mt-4 ">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
