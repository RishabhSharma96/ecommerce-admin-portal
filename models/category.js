import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        unique: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    properties: [{type: Object}]
});


const Category = models?.Category || model('Category', CategorySchema)
export default Category 