import mongoose from "mongoose"

export const connectDB = async () => {
    try {
      const conn =  await mongoose.connect(process.env.MONGO_URI);
      console.log( `MongoDB connected: ${conn.connection.host }`);
    } catch (error){
        console.log("ERROR ES TU BASE DE DATOS LLORA", error.mesagge);
        process.exit(1);

    }
}