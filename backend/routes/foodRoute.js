import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";        //for uploading images

const foodRouter = express.Router(); //used for get,post and other methods

//image storage engine
//setting how and where data will be stored
const storage = multer.diskStorage({    
    destination:"uploads",
    filename: (req,file,calbak) =>{
        return calbak(null,`${Date.now()}${file.originalname}`)
    }
})
//multer instance
const upload = multer({storage:storage})    //middlware created using multer

//.single -> upload instance expects a single file with field name image  
foodRouter.post("/add",upload.single('image') ,addFood)   
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)


export default foodRouter;