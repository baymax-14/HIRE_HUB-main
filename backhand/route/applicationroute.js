import express from 'express'
import isauthenticate from '../middleware/isAuthenticate.js';
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();
import{applyjob,getAppliedjob,getApplicants,updateStatus,reAnalyzeApplicant} from "../controller/applicationcontroller.js";


router.get("/get",isauthenticate,getAppliedjob);
//all the applicant who has applied for the post
router.get("/:id/applicants",isauthenticate,getApplicants);
router.post("/status/:id/update",isauthenticate,updateStatus);
router.post("/:id/reanalyze",isauthenticate,reAnalyzeApplicant);

router.post("/apply/:id",isauthenticate,singleUpload,applyjob);


export default router;