import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type: String,  // ✅ Cambiado de "Type" a "type"
        required: [ true , "Nombre requerido" ] 
    },
    email:{
        type: String,
        required: [ true , "Email requerido" ],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required:[true, "Contraseña requerida"],
        minlength: [6, "la contraseña debe tener al menos 6 caracteres"]
    },
    cartItems:[
        {
            quantity:{
                type:Number,
                default:1
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    role:{
        type: String,
        enum: ["customer" , "admin"],
        default: "customer"
    },
},
{
    timestamps: true,
}
)

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next ();

    try {
       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password , salt);
       next()
    } catch (error) {
       next(error)
    }
})

// compara las contra q introduce el usuario con la que tiene en la base de datos
userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password , this.password);
}

const User = mongoose.model("User", userSchema);

export default User;