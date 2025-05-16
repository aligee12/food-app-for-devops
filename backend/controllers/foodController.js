//creating api for adding food item to database
//here api(bridge between software programs) mean functionality for adding food item
import foodModel from "../models/foodModel.js";
import fs from 'fs'

//addFood is expecting a form data as file used in it can't be sent using json
const addFood = async (req,res) => {    
    let image_filename = `${req.file.filename}`;
    //req.file => uploaded file

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category
    })
    

    try {
        await food.save();
        res.json({success:true,message:"food Added"})
    } catch (error) {
        console.log(`we got an error while saving food: ${error}`)
        res.json({success:false,message:"Error while saving food"})
    }
}
const listFood = async (req,res) => {
    try {
        const food = await foodModel.find({});  //({}) -> empty filter -> get all food items
        res.json({success:true,data:food})
    } catch (error) {
        console.log(`we got an error while listing food: ${error}`)
        res.json({success:false,message:"Error while getting food"})
    }
}
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{});  //deleting img from uploads

        await foodModel.findByIdAndDelete(req.body.id) //removing form db
        res.json({success:true,message:"food Removed"})
    } catch (error) {
        console.log(`we got an error while removing food: ${error}`)
        res.json({success:false,message:"Failed to remove"})
    }
}




export {addFood,listFood,removeFood}