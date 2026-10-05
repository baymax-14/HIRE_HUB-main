import { Link, useNavigate } from "react-router-dom"
import Navbar from "../shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup } from "../ui/radio-group"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setuser } from "@/redux/authSlice"
import { Loader2, Sparkles } from "lucide-react"
import GradientWaves from "../ui/GradientWaves"

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student", // Default role so users don't get blocked
  })

  const { loading, user } = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!input.email || !input.password) {
      toast.error("Please enter both email and password")
      return
    }

    try {
      dispatch(setLoading(true))
      axios.defaults.withCredentials = true

      const payload = {
        email: input.email.trim(),
        password: input.password,
        role: input.role || "student",
      }

      const res = await axios.post(`${USER_API_END_POINT}/login`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        }
        dispatch(setuser(res.data.user))
        toast.success(res.data.message || "Logged in successfully!")
        navigate("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error?.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    dispatch(setLoading(false))
    if (user) {
      navigate("/")
    }
  }, [user, navigate, dispatch])

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
          className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-[440px] bg-white/92 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-purple-950/40 transition-all duration-300"
        >
          {/* Badge & Title */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>HireHub Portal</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Login to access your HireHub account
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@example.com"
                required
                className="mt-1.5 h-11 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                required
                className="mt-1.5 h-11 bg-white/80 border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="mt-5 bg-purple-50/60 border border-purple-100/80 rounded-xl p-3">
            <Label className="text-xs font-semibold text-gray-700 block mb-2">Login as:</Label>
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
                Student
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

          {loading ? (
            <Button className="w-full my-5 h-11 rounded-xl bg-purple-600 text-white font-medium" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Logging in...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-5 cursor-pointer h-11 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-600/25 transition-all active:scale-[0.99]"
            >
              Log In
            </Button>
          )}

          <div className="text-center pt-1 border-t border-gray-100">
            <span className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:text-purple-700 hover:underline font-semibold ml-1">
                Create Account
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
