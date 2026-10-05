"use client";

import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/util/const";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import GradientWaves from "../ui/GradientWaves";

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: "",
  });

  const navigate = useNavigate();
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role || "student");
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }

    // Ensure loading resets on refresh
    dispatch(setLoading(false));
  }, [user, navigate, dispatch]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0b081d] overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Interactive 3D Gradient Waves matching HireHub purple & pink theme */}
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#0b081d"
          waveColor="#6A38C2"
          crestColor="#ec4899"
          speed={0.35}
          amplitude={2.3}
          waveScale={0.65}
          waveRatio={0.9}
          tilt={1.12}
          fogDepth={16}
          brightness={1.05}
          opacity={0.92}
          mouseInteraction={true}
          parallaxStrength={0.55}
          className="w-full h-full"
        />
      </div>

      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-700/20 blur-[120px] rounded-full z-[1]" />

      {/* Navigation */}
      <div className="relative z-20">
        <Navbar transparent />
      </div>

      {/* Main Form Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">

          {/* Glass card */}
          <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/15 shadow-2xl shadow-purple-950/60 p-8 flex flex-col items-center">

            {/* Logo mark */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-700/40 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Join HireHub
            </h1>
            <p className="text-sm text-gray-400 mb-6 text-center">
              Start finding opportunities or hiring top talent today
            </p>

            {/* Form */}
            <form onSubmit={submitHandler} className="flex flex-col w-full gap-3">

              {/* Full Name */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="Phone Number (optional)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Role selector */}
              <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-gray-400 font-medium mr-1">Register as:</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="accent-purple-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  Student
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors ml-2">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="accent-purple-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  Recruiter
                </label>
              </div>

              {/* Profile Picture */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-gray-400 font-medium block mb-2">Profile Picture (Optional)</span>
                <input
                  accept="image/*"
                  type="file"
                  onChange={fileHandler}
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600/30 file:text-purple-300 hover:file:bg-purple-600/50 hover:file:text-purple-200 transition-all cursor-pointer"
                />
              </div>

              <hr className="border-white/10 my-1" />

              {/* Submit */}
              {loading ? (
                <button
                  disabled
                  className="w-full py-3 rounded-full bg-purple-700/70 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-700/30 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Create Account
                </button>
              )}

              {/* Login link */}
              <div className="text-center mt-1">
                <span className="text-xs text-gray-400">
                  {"Already have an account? "}
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Log In
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex flex-col items-center text-center">
            <p className="text-gray-500 text-xs mb-2">
              Trusted by <span className="text-white font-medium">thousands</span> of job seekers &amp; recruiters
            </p>
            <div className="flex -space-x-2">
              {[
                "https://cdn.21st.dev/assets/mirror/a6/a634d4f02fe5b77804943c1d74b8d70e35ffe26454e0e9af9717432a2c72bfde.jpg",
                "https://cdn.21st.dev/assets/mirror/d8/d8dab29a5736d5c2b0084d720d3db02c785560071609be501541922928fdf831.jpg",
                "https://cdn.21st.dev/assets/mirror/d1/d1a3e08d4e37d6ee2b7de1db8df87c1dc7acd8ffb004caaf980917de518a60c9.jpg",
                "https://cdn.21st.dev/assets/mirror/f0/f07b84f12ef125cbb837a7bd64da401992f5f62bd55fee10d01cd3dcc8abae80.jpg",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="user"
                  className="w-8 h-8 rounded-full border-2 border-[#0b081d] object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
