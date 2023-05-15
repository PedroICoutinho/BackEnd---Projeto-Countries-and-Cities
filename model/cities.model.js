import {Schema, model, Types} from "mongoose"


const citySchema = new Schema({
    name: {type: String, required: true},
    population: {type: String, required: true},
    img: {type: String, },
    creator: {type: Types.ObjectId, ref: "Creator"},
    country: {type: Types.ObjectId, ref: "Country"}
})



export const CityModel = model("City", citySchema)