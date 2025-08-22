
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./Lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //permite analizar el cuerpo del pedido
app.use(cookieParser());


app.use("/api/auth" , authRoutes)


app.listen(PORT, () => {
    console.log("el servidor esta funcionando en http://localhost:" + PORT);

   connectDB(); 
});


//6brxQ1XRuzDWtR65