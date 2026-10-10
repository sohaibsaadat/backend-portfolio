import jwt from "jsonwebtoken"

export  const adminLogin = async (req,res) => {
    try {

        const {email,password} = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        
        const token =  jwt.sign(email,process.env.JWT_SECRET)
              
        return res.json({ success: true, token });


    } else {
               return res.json({ success: false, message:"Not Authorized" });
 
    }
        
    } catch (error) {
                       return res.json({ success: false, message:error.message });

    }
}