import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./components/shared/Navbar"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import Home from "./components/Home"
import Jobs from "./components/jobscard/Jobs"
import Viewprofile from "./components/Viewprofile"
import Jobdescription from "./components/Jobdexcription"
import Companies from "./components/admin/Companies"
import Registercom from "./components/admin/Registerom"
import Companysetup from "./components/admin/Comapnysetup"
import Jobsadmin from "./components/admin/Adminjobs"
import Postjobs from "./components/admin/Postjobs"
import Applicants from "./components/admin/Applicants"
import Dashboard from "./components/admin/Dashboard"
import ProtectedRoute from "./components/admin/ProtectedRoute"
const appROuter = createBrowserRouter([
  {
    path:"/",
    element:<Home />
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/signup",
    element:<Signup />
  },
   {
    path:"/jobs",
    element:<Jobs />
  },
  {
    path:"/description/:id",
    element:<Jobdescription />
  },
   {
    path:"/browse",
    element:<Jobs />
  },
   {
    path:"/profile",
    element:<Viewprofile/>
  },
  //admin
  {
    path:"/admin/dashboard",
    element:<ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element:<ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element:<ProtectedRoute><Registercom /></ProtectedRoute>
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><Companysetup /></ProtectedRoute>
  },
  //after clickon jobs
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><Jobsadmin /></ProtectedRoute>
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><Postjobs /></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants /></ProtectedRoute>
  }
])

function App() {
  return (
   <RouterProvider router = {appROuter} />
  )
}

export default App
