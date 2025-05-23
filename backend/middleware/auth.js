//a middleware for authenticating the user or for decoding the token
import jwt from "jsonwebtoken";

const authMiddleWare = async (req,res,next) => {
    const {token} = req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorized! Login again"})
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();

    } catch (error) {
        console.log(error)
        res.json({succes:false,message:"Error"})
        
    }
}
export default authMiddleWare;
 

