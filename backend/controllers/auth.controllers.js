import { redis } from "../Lib/redis.js";
import User from  "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) =>{
 
    const acessToken = jwt.sign({ userId} , process.env.ACESS_TOKEN_SECRET , {
   expiresIn: "15m",
 });
 const refreshToken = jwt.sign({ userId} , process.env.REFRESH_TOKEN_SECRET , {
   expiresIn: "7d",

});

return { acessToken, refreshToken} 

};

const storeRefreshToken =  async (userId,refreshToken) =>{
    await redis.set(`refresh_token:${userId}` , refreshToken , "EX" , 7*24*60*60);

}
const setCookies = (res , acessToken , refreshToken) =>{
    res.cookie ("acessToken" , acessToken , {
        httpOnly: true , //previene ataques xxs
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", //previene ataques CSRF
        maxAge: 15*60*1000,
    });
     res.cookie ("refreshToken" , refreshToken , {
        httpOnly: true , //previene ataques xxs
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", //previene ataques CSRF
        maxAge: 7*24*60*1000,
});
 };

export const signup =  async (req , res)=> {
    const {email , password , name} = req.body
try {
        const userExists = await User.findOne({email});

    if (userExists){
        return res.status(400).json({ message: "el usuario existe"});
    }
    const user = await User.create({name , email , password});


   const { acessToken  , refreshToken} = generateTokens (user._id)
   await storeRefreshToken(user._id , refreshToken);

   setCookies (res , acessToken , refreshToken);

    res.status(201).json({ user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

    }   , message:"el usuario se creo existosamente"});

} catch (error) {
    res.status(500).json({message: error.message});
}
    
};

export const login =  async (req , res)=> {
    res.send("login up route called");
};


export const logout = async (req , res)=> {
    try {
        const refreshToken =  req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message:"deslogeo exitoso"});
    } catch (error){
  res.status(500).json({message:"severa error",error:error.message});
    }
};
    
