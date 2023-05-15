import express from "express"
import { CityModel } from "../model/cities.model"

const cityRouter = express.Router()

cityRouter.post("/", async(req, res)=>{
    try{
        const city = await CityModel.create(req.body)

        


    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})

cityRouter.get("/", async (req,res)=>{
    try{
        const allCities = await CityModel.find();

        return res.status(200).json(allCities);
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})



export { cityRouter };