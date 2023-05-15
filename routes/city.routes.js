import express from "express"
import { CityModel } from "../model/cities.model.js"
import isAuth from "../middlewares/isAuth.js"
import attachCurrentUser from "../middlewares/attachCurrentUser.js"
import { UserModel } from "../model/user.model.js"
import { CountryModel } from "../model/country.model.js"

const cityRouter = express.Router()


//Criando cidade - Funcionando!!

cityRouter.post("/:countryId",isAuth, attachCurrentUser, async(req, res)=>{
    try{
        const city = await CityModel.create({
            ...req.body,
            creator: req.currentUser._id,
            country: req.params.countryId
        })

        await CountryModel.findOneAndUpdate(
            {_id: req.params.countryId},
            {$push: {cities: city._id}},
            {new: true, runValidators: true})

        await UserModel.findOneAndUpdate(
            {_id: req.currentUser._id},
            {$push: {cities: city._id}},
            {new: true, runValidators: true})


            return res.status(201).json(city)
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})

//Pegando as cidades - Funcionando!!

cityRouter.get("/", async (req,res)=>{
    try{
        const allCities = await CityModel.find();

        return res.status(200).json(allCities);
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})

// Pegando um pais - Funcionando!

cityRouter.get("/:id", async (req,res)=>{
    try{
        const oneCity = await CityModel.findOne({_id: req.params.id}).populate("country")

        return res.status(200).json(oneCity);
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})



cityRouter.delete("/:id", isAuth, attachCurrentUser, async (req, res)=>{
    try{
        const city = await CityModel.findOne({_id: req.params.id})

        if(`${city.creator}` !== `${req.currentUser._id}`){
            return res.status(401).json("You can't delete other user city") 
        }

        const deleteCity = await CityModel.deleteOne({_id: req.params.id})

        await UserModel.findOneAndUpdate(
            {_id: req.currentUser._id},
            {$pull: {cities: city._id}},
            {runValidators: true}) 
            
        await CountryModel.findOneAndUpdate(
            {_id: city.country},
            {$pull: {cities: city._id}},
            { runValidators: true})



            return res.status(200).json(deleteCity)  
            
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})



export { cityRouter };