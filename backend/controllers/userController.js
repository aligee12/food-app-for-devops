import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//login and register methods are expecting a simple json data.
const logInUser = async (req,res) =>{
    const {email,password} = req.body; 
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success:"false",
                message:"User Doesn't exist"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({
                success:"false",
                message:"Invalid Credentials"
            })
        }
        const token = createToken(user._id);
        res.json({success:"true",token});

    } catch (error) {
        console.log(error);
        return res.json({
            success:"false",
            message:"Error"
        });
    }
}

const registerUser = async (req,res) =>{
    const {name,email,password} = req.body; 
    try {
        //checking if user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({
                success:"false",
                message:"User Already Registered"
            })
        }
        //validating email format && strong password
        if(!validator.isEmail(email)){
            return res.json({
                success:"false",
                message:"Provide a Valid Email"
            })
        }
        if(password.length<8){
            return res.json({
                success:"false",
                message:"Password is too short"
            })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);    //random string added to password
        const hashedPass = await bcrypt.hash(password,salt)

        //creating a new user
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPass
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({success:"true",token})

    } catch (error) {
        console.log(error)
        return res.json({
            success:"false",
            message:"Error"
        })
    }
    
    
}

export {logInUser,registerUser}