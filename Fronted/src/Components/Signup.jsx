import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import RegisterImage from "../Image/Registerimg.png";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    pic: "",
  });
  const [showPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const postDetails = async (file) => {
    setUploadingImage(true);
    if (!file) {
      toast.warn("Please add a Profile Picture");
      setUploadingImage(false);
      return;
    }

    if (file.type !== "image/png") {
      toast.error("Only .png images are accepted");
      setUploadingImage(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "DELinkChatApp");
    data.append("cloud_name", "dfcaehp0b");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dfcaehp0b/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setFormData({ ...formData, pic: result.url.toString() });
      setUploadingImage(false);
    } catch (err) {
      toast.error("Image upload failed");
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirm_password) {
      toast.warn("Please enter all required fields");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      toast.warn("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const userData = {
          token: data.token,
          name: data.user.name,
          email: data.user.email,
          pic: data.user.pic,
        };
        setUser(userData);
        localStorage.setItem("deLinkUser", JSON.stringify(userData));

        toast.success("User Registered Successfully");
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
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
          <span>Register Successful!</span>
        </div>
      )}

      <div className="h-120 min-w-[250px] flex justify-center mb-8 md:mb-0">
        <img
          src={RegisterImage}
          alt="Register Illustration"
          className="max-w-md w-full h-auto rounded-lg"
        />
      </div>

      <div className="h-120 min-w-[350px] bg-white p-6 shadow-md rounded-md max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mt-0 mb-4">Register</h2>

        {message && <p className="text-center text-red-500 mb-3">{message}</p>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="file"
            accept="image/png"
            onChange={(e) => postDetails(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className={`w-full py-3 font-bold rounded-md text-white ${
              loading || uploadingImage ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading || uploadingImage}
          >
            {loading || uploadingImage ? "Processing..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </div>
    </main>
  );
};

export default Register;
