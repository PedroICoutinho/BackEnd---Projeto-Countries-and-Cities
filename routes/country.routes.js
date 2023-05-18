import express from "express"
import { CountryModel } from "../model/country.model.js"
import isAuth from "../middlewares/isAuth.js"
import attachCurrentUser from "../middlewares/attachCurrentUser.js"
import { UserModel } from "../model/user.model.js"


const countryRouter = express.Router()

//Criar Pais - Funcionando!

countryRouter.post("/create-country", isAuth, attachCurrentUser, async (req, res)=>{
    try{
        const { name } = req.body
        const countryExist = await CountryModel.findOne({name})

        if(countryExist){
            return res.status(409).json("Sorry, country already exist")
        }

        const country = await CountryModel.create({
            ...req.body, 
            creator: req.currentUser._id
        });

        await UserModel.findOneAndUpdate(
            {_id: req.currentUser._id},
            {$push: {countries: country._id}},
            {new: true, runValidators: true})

        return res.status(201).json(country);
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})

// Pegar todos os paises - Funcionando!

countryRouter.get("/", async (req,res)=>{
    try{
        const allCountries = await CountryModel.find();

        return res.status(200).json(allCountries);
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})

// Pegando um só pais pelo ID - Funcionando!
countryRouter.get("/:id", async (req, res)=>{
    try{
        const country = await CountryModel.findOne({ _id: req.params.id}).populate("cities")

        return res.status(200).json(country)
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})


// Deletando o pais - Funcionando!

countryRouter.delete("/:id", isAuth, attachCurrentUser, async (req, res)=>{
    try{
        const country = await CountryModel.findOne({_id: req.params.id})

        if(`${country.creator}` !== `${req.currentUser._id}`){
            return res.status(401).json("You can't delete other user country")
        }

        const deleteCountry = await CountryModel.deleteOne({_id: req.params.id})

        await UserModel.findOneAndUpdate(
            {_id: req.currentUser._id},
            {$pull: {countries: country._id}},
            {runValidators: true})

            return res.status(200).json(deleteCountry)
    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
})
 

export { countryRouter };