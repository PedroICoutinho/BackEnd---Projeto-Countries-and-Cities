import {Schema, model, Types} from "mongoose"


const countrySchema = new Schema({
    name: {type: String, required: true},
    flag: {type: String, required: true},
    continent: {type: String, required: true},
    creator: {type: Types.ObjectId, ref: "Creator"},
    cities: [{type: Types.ObjectId, ref: "City"}]
})



export const CountryModel = model("Country", countrySchema)