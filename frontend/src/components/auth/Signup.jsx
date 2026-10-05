"use client";

import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/util/const";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, Sparkles } from "lucide-react";
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
      {/* Interactive 3D Gradient Waves matching HireHub's purple & pink theme */}
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
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full z-[1]" />

      {/* Navigation */}
      <div className="relative z-20">
        <Navbar transparent />
      </div>

      {/* Main Form Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <form
          onSubmit={submitHandler}
          className="w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-[480px] bg-white/92 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-purple-950/40 transition-all duration-300"
        >
          {/* Badge & Title */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Create Your Account</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
              Join HireHub
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Start finding opportunities or hiring top talent today
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Full Name</Label>
              <Input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="e.g. Anand Rathod"
                required
                className="mt-1.5 h-11 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="name@example.com"
                required
                className="mt-1.5 h-11 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Phone Number</Label>
              <Input
                type="tel"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="+91 9876543210"
                className="mt-1.5 h-11 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Create a strong password"
                required
                className="mt-1.5 h-11 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="mt-5 space-y-3 bg-purple-50/60 border border-purple-100/80 rounded-xl p-3 sm:p-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 block mb-2">Register as:</Label>
              <RadioGroup className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer accent-purple-600 w-4 h-4"
                  />
                  Student (Job Seeker)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="cursor-pointer accent-purple-600 w-4 h-4"
                  />
                  Recruiter
                </label>
              </RadioGroup>
            </div>

            <div className="pt-2 border-t border-purple-200/50">
              <Label className="text-xs font-semibold text-gray-700 block mb-1.5">Profile Picture (Optional)</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={fileHandler}
                className="cursor-pointer text-sm bg-white/80 border-gray-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 rounded-xl"
              />
            </div>
          </div>

          {loading ? (
            <Button className="w-full my-5 h-11 rounded-xl bg-purple-600 text-white font-medium" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating account...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-5 cursor-pointer h-11 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-600/25 transition-all active:scale-[0.99]"
            >
              Sign Up
            </Button>
          )}

          <div className="text-center pt-1 border-t border-gray-100">
            <span className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 hover:underline font-semibold ml-1">
                Log In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
