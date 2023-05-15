import {Schema, model} from "mongoose"


const citySchema = new Schema({
    name: {type: String, required: true},
    population: {type: String, required: true},
    img: {type: String, required: true}
})



export const CityModel = model("City", citySchema)