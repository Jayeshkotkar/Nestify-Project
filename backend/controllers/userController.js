import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


// Login User
const loginUser = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    // console.log('Login attempt:', email);
    // Validate input first
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email" });
    }
    try{
        const user = await userModel.findOne({email});
        console.log('User found:', user);
        if(!user){
            return res.status(400).json({ success: false, message: "User Doesn't exist" })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        // console.log('Password match:', isMatch);
        if(!isMatch){
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }
        const token = createToken(user._id);
        res.json({success:true,token, userId:user._id});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}


// Create Token
const createToken = (id) =>{
    const secret = process.env.JWT_SECRET || "dev_insecure_secret_change_me";
    return jwt.sign({id}, secret, {expiresIn:"3d"});
}


// Register User
const registerUser = async (req, res) => {
    let { name, email, password } = req.body;
    console.log("Register attempt:", req.body);
    email = email.trim().toLowerCase();
    // console.log('Register attempt:', email);
    try {
        // checking a user is already exist or not.
        const user = await userModel.findOne({ email });
        // console.log('Existing user:', user);


        if (user) {
            return res.status(400).json({ success:false,message: "User already exists" });
        }
        // validating email format and strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({ success:false, message:"Please Enter Valid Email" });
        }
        // checking password length
        if(password.length < 8){
            return res.status(400).json({ success:false, message:"Please Enter Strong Password" })
        }
        
        // hashing user password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // register new user
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        });
        
        const newuser = await newUser.save();

        console.log("New user created:", newuser);

        // console.log('New user created:', newuser);
        const token = createToken(newuser._id);
        res.json({success:true,token, userId:newuser._id});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: "Internal server error" });
    } 
}

export { loginUser, registerUser };