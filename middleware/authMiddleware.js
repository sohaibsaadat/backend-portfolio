import jwt from "jsonwebtoken"


const adminAuth = async (req,res,next) => {
    try {
        const token = req.headers.token

        if (!token) {
            return res.status(401).json({success:false,message:"Token not found"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const email = typeof decoded === "string" ? decoded : decoded.email


        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({success:false,message:"Not Authorized"})
        }

        req.email = email

        next();

    } catch (error) {
        return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
    }
}
export default adminAuth