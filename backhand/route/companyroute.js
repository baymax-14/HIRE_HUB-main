import express from 'express'
import isauthenticate from '../middleware/isAuthenticate.js';
const router = express.Router();
import {registerCompany,getCompany,companybyId,updatecompany,deleteCompany} from "../controller/companycontro.js";
import {singleUpload} from "../middleware/multer.js"

router.post("/registerC", isauthenticate,registerCompany);
router.get("/get" ,isauthenticate,getCompany);
router.get("/get/:id",isauthenticate,companybyId)
router.put("/update/:id", isauthenticate,singleUpload,updatecompany);
router.delete("/delete/:id", isauthenticate,deleteCompany);

export default router;