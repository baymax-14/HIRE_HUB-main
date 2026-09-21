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
import { Loader2 } from "lucide-react"

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
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submitHandler}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 border border-gray-200 rounded-2xl p-6 sm:p-8 my-6 sm:my-8 lg:my-10 shadow-xs bg-white"
        >
          <h1 className="font-bold mb-1 text-2xl text-center sm:text-left text-gray-900">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-5">Login to access your HireHub account</p>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@example.com"
                required
                className="mt-1.5 h-10 sm:h-11"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter password"
                required
                className="mt-1.5 h-10 sm:h-11"
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="text-xs font-semibold text-gray-600 block mb-2">Login as:</Label>
            <RadioGroup className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer accent-indigo-600 w-4 h-4"
                />
                Student
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer accent-indigo-600 w-4 h-4"
                />
                Recruiter
              </label>
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full my-5 h-11" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Logging in...
            </Button>
          ) : (
            <Button type="submit" className="w-full my-5 cursor-pointer h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              Log In
            </Button>
          )}

          <div className="text-center">
            <span className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:underline font-semibold">
                Create Account
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
