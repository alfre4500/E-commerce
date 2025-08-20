import User from  "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) =>{
 
    const acessToken = jwt.sign({ userId} , process.env.ACESS_TOKEN_SECRET , {
   expiresIn: "15m",
 })
 const refreshToken = jwt.sign({ userId} , process.env.REFRESH_TOKEN_SECRET , {
   expiresIn: "7d",

})

return { acessToken, refreshToken} 

}

export const signup =  async (req , res)=> {
    const {email , password , name} = req.body
try {
        const userExists = await User.findOne({email});

    if (userExists){
        return res.status(400).json({ message: "el usuario existe"});
    }
    const user = await User.create({name,email,password});

   const {acessToken, RefreshToken} = generateTokens (user._id)

    res.status(201).json({user,message:"el usuario se creo existosamente"});
} catch (error) {
    res.status(500).json({message: error.message});
}
    
};

export const login =  async (req , res)=> {
    res.send("login up route called");
};

export const logout =  async (req , res)=> {
    res.send("logout up route called");
};