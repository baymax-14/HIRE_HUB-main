import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Loader2, FileText, Camera } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/util/const"
import { setLoading, setuser } from "@/redux/authSlice"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Avatar, AvatarImage } from "./ui/avatar"

export default function Updateprofile({ open, setOpen }) {
  const { loading, user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()

  const [input, setInput] = useState({
    fullname: "",
    PhoneNumber: "",
    email: "",
    bio: "",
    skills: "",
    profilePhoto: null,
    file: null,
  })
  const [photoPreview, setPhotoPreview] = useState(null)

  // Sync with user data when opening or when user changes
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user?.fullname || "",
        PhoneNumber: user?.phoneNumber || "",
        email: user?.email || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        profilePhoto: null,
        file: null,
      })
      setPhotoPreview(user?.profile?.profilephoto || null)
    }
  }, [user, open])

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const fileHandler = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setInput({ ...input, file: selected })
    }
  }

  const photoHandler = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, WEBP)")
        return
      }
      setInput({ ...input, profilePhoto: selected })
      setPhotoPreview(URL.createObjectURL(selected))
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("fullname", input.fullname)
    formData.append("email", input.email)
    formData.append("phoneNumber", input.PhoneNumber)
    formData.append("bio", input.bio)
    formData.append("skills", input.skills)
    
    if (input.profilePhoto instanceof File) {
      formData.append("profilePhoto", input.profilePhoto)
    }

    if (input.file instanceof File) {
      formData.append("file", input.file)
    }

    try {
      dispatch(setLoading(true))
      axios.defaults.withCredentials = true
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (res.data.success) {
        dispatch(setuser(res.data.user))
        toast.success(res.data.message || "Profile updated successfully!")
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[95vw] max-w-[425px] sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-3 sm:gap-4 py-1">
            {/* Profile Picture Upload Section */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-gray-100">
              <Avatar className="h-16 w-16 border shadow-xs shrink-0">
                <AvatarImage src={photoPreview || "/placeholder.svg"} className="object-cover" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <Label htmlFor="profilePhoto" className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
                  Profile Picture
                </Label>
                <Input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  onChange={photoHandler}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="text-xs h-9 cursor-pointer file:text-xs"
                />
                <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, or WEBP (Max 10MB)</p>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-sm sm:text-base">
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                name="fullname"
                className="w-full h-10 sm:h-11"
                value={input.fullname}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                className="w-full h-10 sm:h-11"
                value={input.email}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="number" className="text-sm sm:text-base">
                Phone Number
              </Label>
              <Input
                id="number"
                name="PhoneNumber"
                className="w-full h-10 sm:h-11"
                value={input.PhoneNumber}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="bio" className="text-sm sm:text-base">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                className="w-full h-10 sm:h-11"
                value={input.bio}
                onChange={changeEventHandler}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="skills" className="text-sm sm:text-base">
                Skills (comma separated)
              </Label>
              <Input
                id="skills"
                name="skills"
                placeholder="e.g. React, Node.js, Python, SQL"
                className="w-full h-10 sm:h-11"
                value={input.skills}
                onChange={changeEventHandler}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="file" className="text-sm sm:text-base">
                Resume (PDF)
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                onChange={fileHandler}
                accept="application/pdf"
                className="w-full h-10 sm:h-11 cursor-pointer"
              />
              {user?.profile?.resume && !input.file && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Current resume: <span className="font-medium text-gray-700">{user?.profile?.resumeOriginalName || "Uploaded"}</span>
                </p>
              )}
              {input.file && (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Selected file: {input.file.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            {loading ? (
              <Button disabled className="w-full h-10 sm:h-11">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full h-10 sm:h-11 cursor-pointer">
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
