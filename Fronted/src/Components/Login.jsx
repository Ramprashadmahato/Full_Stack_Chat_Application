import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import LoginImage from "../Image/Registerimg.png";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { validateEmail } from "../Util/valid";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://full-stack-chat-application-tbwc.onrender.com/";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { email, password } = formData;

    if (!email || !password) {
      toast.warn("Please enter all required fields");
      return;
    }
    if (!validateEmail(email)) {
      toast.warn("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          token: data.token,
          role: data.user.role,
          name: data.user.name,
          email: data.user.email,
        };
        setUser(userData);
        localStorage.setItem("deLinkUser", JSON.stringify(userData));

        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          navigate("/");
        }, 2000);

        toast.success("User Logged In Successfully");
      } else {
        setMessage(data.message || "Invalid credentials");
        toast.error(data.message || "Login Failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error. Please try again later.");
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="bg-gray-50 flex flex-wrap justify-center items-center py-10 px-4 min-h-[60vh] relative">
      {success && (
        <div className="absolute top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded flex items-center space-x-2 shadow-md">
          <AiOutlineCheckCircle className="text-2xl" />
          <span>Login Successful!</span>
        </div>
      )}

      <div className="h-105 min-w-[250px] flex justify-center mb-8 md:mb-0">
        <img
          src={LoginImage}
          alt="Login Illustration"
          className="max-w-md w-full h-auto rounded-lg"
        />
      </div>

      <div className="min-w-[250px] bg-white p-8 shadow-md rounded-md max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h2>

        {message && <p className="text-center text-red-500 mb-3">{message}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="password" className="mb-2 font-semibold text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="text-right">
            <a href="/forget-password" className="text-blue-500 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </main>
  );
};

export default Login;
