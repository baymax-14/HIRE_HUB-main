import express from 'express'
import { postjob, getAllJob, getjobid, getAdminjob, deleteJob, toggleJobAlerts, updateJob } from "../controller/jobcontroller.js";
import isauthenticate from '../middleware/isAuthenticate.js';
const router = express.Router();

router.post("/post", isauthenticate, postjob);
router.get("/get", getAllJob);
router.get("/get/:id", getjobid);
router.get("/getadminjobs", isauthenticate, getAdminjob);
router.put("/update/:id", isauthenticate, updateJob);
router.put("/toggle-alerts/:id", isauthenticate, toggleJobAlerts);
router.delete("/delete/:id", isauthenticate, deleteJob);


export default router;