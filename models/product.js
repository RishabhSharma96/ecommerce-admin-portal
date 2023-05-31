import mongoose, { Schema, models, model } from "mongoose";

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
        ref: 'Category'
    },
    properties: { type: Object }

});


const Product = models?.Product || model('Product', ProductSchema)
export default Product 