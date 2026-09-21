import { json } from 'express';
import jwt from 'jsonwebtoken';

const isauthenticate = async (req,res,next) => {
   try {
     const token =
       req.cookies?.token ||
       (req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")
         ? req.headers.authorization.split(" ")[1]
         : req.headers?.authorization) ||
       req.headers?.token;

     if(!token)
     {
          return res.status(401).json({
             message:"User not Authenticated. Please log in.",
             success:false
          })
     }
       const secretKey = process.env.SECRET_KEY || process.env.SECREATE_KEY || "hirehub_secret_key_2026";
      const decode = await jwt.verify(token, secretKey);
      if(!decode)
      {
        return res.status(401).json({
            message:"Invalid token",
            success:false
        })
      }
      //if decode pass the id we store  becoz aapn token kadhun ghetl
      req.id = decode.userid;
      next();
   } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "User not Authenticated",
      success: false
    });
   }
}

export default isauthenticate;