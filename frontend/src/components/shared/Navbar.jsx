import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { LogOut, User2, Menu, X, ChevronDown, Plus } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setuser } from "@/redux/authSlice"
import NotificationBell from "./NotificationBell"

export default function Navbar({ transparent = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isTransparent = transparent || location.pathname === "/login" || location.pathname === "/signup"

  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      })

      if (res.data.success) {
        dispatch(setuser(null))
        dispatch({ type: "auth/logout" })
        navigate("/")
        toast.success(res.data.message || "Logged out successfully")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(error?.response?.data?.message || "Failed to log out")
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      isTransparent
        ? "bg-transparent border-transparent shadow-none"
        : "bg-white/85 backdrop-blur-md shadow-xs border-b border-[#f1f5f9]"
    }`}>
      <div className="flex items-center justify-between mx-auto h-20 px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center group py-2">
            <span className={`font-heading text-2xl font-black tracking-tight transition-transform group-hover:scale-[1.02] ${
              isTransparent ? "text-white" : "text-[#131b2e]"
            }`}>
              Hire<span className="bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] bg-clip-text text-transparent">Hub</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <ul className={`flex items-center font-medium gap-1 lg:gap-2 text-sm lg:text-[15px] ${
            isTransparent ? "text-gray-200" : "text-[#4a4455]"
          }`}>
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/dashboard" className="relative px-3.5 py-2 transition-colors hover:text-[#630ed4] group font-semibold">
                    <span>Dashboard</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#630ed4] rounded-full transition-all duration-300 group-hover:w-6" />
                  </Link>
                </li>
                <li>
                  <Link to="/admin/companies" className="relative px-3.5 py-2 transition-colors hover:text-[#630ed4] group font-semibold">
                    <span>Companies</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#630ed4] rounded-full transition-all duration-300 group-hover:w-6" />
                  </Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="relative px-3.5 py-2 transition-colors hover:text-[#630ed4] group font-semibold">
                    <span>Jobs</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#630ed4] rounded-full transition-all duration-300 group-hover:w-6" />
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/jobs" className="relative px-3.5 py-2 transition-colors hover:text-[#630ed4] group font-semibold">
                    <span>Find Jobs</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#630ed4] rounded-full transition-all duration-300 group-hover:w-6" />
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="relative px-3.5 py-2 transition-colors hover:text-[#630ed4] group font-semibold">
                    <span>Companies</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#630ed4] rounded-full transition-all duration-300 group-hover:w-6" />
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="relative px-3.5 py-2 transition-colors hover:text-[#630ed4] group font-semibold">
                    <span>Salaries</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#630ed4] rounded-full transition-all duration-300 group-hover:w-6" />
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Desktop User / Auth section */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/admin/jobs/create"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#131b2e] hover:text-[#630ed4] px-4 py-2 rounded-full border border-slate-200/80 hover:border-[#630ed4]/40 transition-all bg-white hover:bg-[#f2f3ff]"
              >
                <Plus className="w-3.5 h-3.5 text-[#630ed4]" />
                <span>Post a Job</span>
              </Link>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm font-semibold text-[#4a4455] hover:text-[#131b2e] px-3 cursor-pointer"
                >
                  Log in
                </Button>
              </Link>
              <Link
                to="/signup"
                className="shimmer-fx inline-flex items-center justify-center px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#630ed4] via-[#7c3aed] to-[#4b41e1] rounded-full shadow-md shadow-purple-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <span className="ml-1 text-xs">→</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {user.role === "recruiter" && (
                <Link to="/admin/jobs/create">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Job</span>
                  </Button>
                </Link>
              )}
              <NotificationBell />
              <Popover>
              <PopoverTrigger className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full transition-colors border focus:outline-none cursor-pointer ${
                isTransparent
                  ? "border-white/20 hover:bg-white/10 text-white"
                  : "border-gray-200 hover:bg-gray-100 text-gray-800"
              }`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} alt="Profile" />
                </Avatar>
                <div className="hidden lg:flex flex-col text-left text-xs">
                  <span className={`font-semibold max-w-[90px] truncate leading-tight ${
                    isTransparent ? "text-white" : "text-gray-800"
                  }`}>
                    {user?.fullname?.split(" ")[0]}
                  </span>
                  <span className={`text-[10px] capitalize leading-tight ${
                    isTransparent ? "text-gray-300" : "text-gray-500"
                  }`}>
                    {user?.role === "student" ? "Job Seeker" : "Recruiter"}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 ${isTransparent ? "text-gray-300" : "text-gray-500"}`} />
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 mr-4" align="end">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} alt="Profile" />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate text-gray-900">{user?.fullname}</h4>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0 font-normal">
                      {user?.role === "student" ? "Job Seeker" : "Recruiter"}
                    </Badge>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <User2 className="w-4 h-4 text-gray-500" />
                      <span>View Profile</span>
                    </Link>
                  )}
                  {user?.role === "recruiter" && (
                    <>
                      <Link
                        to="/admin/companies"
                        className="flex items-center gap-2 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <span>Manage Companies</span>
                      </Link>
                      <Link
                        to="/admin/jobs"
                        className="flex items-center gap-2 px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <span>Manage Jobs</span>
                      </Link>
                      <Link
                        to="/admin/jobs/create"
                        className="flex items-center gap-2 px-2.5 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Post New Job</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={logouthandler}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            </div>
          )}
        </div>

        {/* Mobile View: Avatar + Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Avatar className="w-8 h-8 border border-gray-200">
              <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} alt="Profile" />
            </Avatar>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className={`p-2 ${isTransparent ? "text-white hover:bg-white/10" : "text-gray-700"}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-3 space-y-4 shadow-xl ${
          isTransparent
            ? "bg-[#0b081d]/95 backdrop-blur-xl border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}>
          {/* User info if logged in */}
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} alt="Profile" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm truncate ${isTransparent ? "text-white" : "text-gray-900"}`}>{user?.fullname}</h4>
                <p className={`text-xs truncate ${isTransparent ? "text-gray-300" : "text-gray-500"}`}>{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
                  {user?.role === "student" ? "Job Seeker" : "Recruiter"}
                </Badge>
              </div>
            </div>
          )}

          <ul className="space-y-2 text-base font-medium">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className={`block py-2 px-2 rounded-md transition-colors ${
                      isTransparent ? "hover:bg-white/10 text-gray-200 hover:text-white" : "hover:bg-gray-100 hover:text-[#F83002]"
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    onClick={closeMobileMenu}
                    className={`block py-2 px-2 rounded-md transition-colors ${
                      isTransparent ? "hover:bg-white/10 text-gray-200 hover:text-white" : "hover:bg-gray-100 hover:text-[#F83002]"
                    }`}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    onClick={closeMobileMenu}
                    className={`block py-2 px-2 rounded-md transition-colors ${
                      isTransparent ? "hover:bg-white/10 text-gray-200 hover:text-white" : "hover:bg-gray-100 hover:text-purple-600"
                    }`}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs/create"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600/30 text-purple-200 font-semibold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Job</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className={`block py-2 px-2 rounded-md transition-colors ${
                      isTransparent ? "hover:bg-white/10 text-gray-200 hover:text-white" : "hover:bg-gray-100 hover:text-[#F83002]"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={closeMobileMenu}
                    className={`block py-2 px-2 rounded-md transition-colors ${
                      isTransparent ? "hover:bg-white/10 text-gray-200 hover:text-white" : "hover:bg-gray-100 hover:text-[#F83002]"
                    }`}
                  >
                    Jobs
                  </Link>
                </li>
                {user && user.role === "student" && (
                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className={`block py-2 px-2 rounded-md transition-colors ${
                        isTransparent ? "hover:bg-white/10 text-gray-200 hover:text-white" : "hover:bg-gray-100 hover:text-[#F83002]"
                      }`}
                    >
                      View Profile
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Logged out state */}
          {!user ? (
            <div className={`flex flex-col gap-2 pt-3 border-t ${isTransparent ? "border-white/10" : "border-gray-200"}`}>
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className={`w-full ${isTransparent ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : ""}`}>
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={closeMobileMenu}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">Sign up</Button>
              </Link>
            </div>
          ) : (
            /* Logged in state - prominent logout button in mobile menu */
            <div className={`pt-3 border-t ${isTransparent ? "border-white/10" : "border-gray-200"}`}>
              <button
                onClick={() => {
                  closeMobileMenu()
                  logouthandler()
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-400 bg-red-950/30 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
