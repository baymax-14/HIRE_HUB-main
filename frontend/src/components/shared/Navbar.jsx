
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { LogOut, User2, Menu, X, ChevronDown, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setuser } from "@/redux/authSlice"
import NotificationBell from "./NotificationBell"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
    <div className="bg-white/80 backdrop-blur-md shadow-xs border-b border-gray-100/80 sticky top-0 z-50 transition-all">
      <div className="flex items-center justify-between mx-auto h-16 px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" onClick={closeMobileMenu}>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              Hire<span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Hub</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <ul className="flex items-center font-medium gap-1 lg:gap-2 text-sm lg:text-[15px] text-gray-600">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/dashboard" className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/60 transition-all duration-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/companies" className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/60 transition-all duration-200">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/60 transition-all duration-200">
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/60 transition-all duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="px-3 py-1.5 rounded-lg hover:text-purple-600 hover:bg-purple-50/60 transition-all duration-200">
                    Find Jobs
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Desktop User / Auth section */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50/60">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm shadow-md shadow-purple-500/20 px-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]" size="sm">
                  Sign up
                </Button>
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
              <PopoverTrigger className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 focus:outline-none cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} alt="Profile" />
                </Avatar>
                <div className="hidden lg:flex flex-col text-left text-xs">
                  <span className="font-semibold text-gray-800 max-w-[90px] truncate leading-tight">
                    {user?.fullname?.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-gray-500 capitalize leading-tight">
                    {user?.role === "student" ? "Job Seeker" : "Recruiter"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
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

          <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-3 space-y-4">
          {/* User info if logged in */}
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profile?.profilephoto || "/placeholder.svg"} alt="Profile" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate text-gray-900">{user?.fullname}</h4>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
                    className="block py-2 px-2 rounded-md hover:bg-gray-100 hover:text-[#F83002] transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    onClick={closeMobileMenu}
                    className="block py-2 px-2 rounded-md hover:bg-gray-100 hover:text-[#F83002] transition-colors"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    onClick={closeMobileMenu}
                    className="block py-2 px-2 rounded-md hover:bg-gray-100 hover:text-purple-600 transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs/create"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 text-purple-700 font-semibold text-sm"
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
                    className="block py-2 px-2 rounded-md hover:bg-gray-100 hover:text-[#F83002] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={closeMobileMenu}
                    className="block py-2 px-2 rounded-md hover:bg-gray-100 hover:text-[#F83002] transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                {user && user.role === "student" && (
                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="block py-2 px-2 rounded-md hover:bg-gray-100 hover:text-[#F83002] transition-colors"
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
            <div className="flex flex-col gap-2 pt-3 border-t">
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={closeMobileMenu}>
                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b2fa3]">Sign up</Button>
              </Link>
            </div>
          ) : (
            /* Logged in state - prominent logout button in mobile menu */
            <div className="pt-3 border-t">
              <button
                onClick={() => {
                  closeMobileMenu()
                  logouthandler()
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
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
