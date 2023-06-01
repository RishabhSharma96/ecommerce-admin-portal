import mongoose, { Schema, models, model } from "mongoose";
import Category from "./category";

const ProductSchema = new Schema({
    productName: {
        type: String,
        unique: true
    },
    productDescription: {
        type: String,
    },
    productPrice: {
        type: Number,
    },
    productImages: {
        type: []
    },
    productCategory: {
        type: Schema.Types.ObjectId,
        ref: Category.modelName
    },
    properties: { type: Object },
    reviews : {
        type: Array,
        default : []
    },
    promoted: {
        type: Boolean,
        default: false
    }

});


const Product = models?.Product || model('Product', ProductSchema)
export default Product 