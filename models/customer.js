import mongoose, { Schema, models, model } from "mongoose";

const CustomerSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    address: {
        type: String
    }

}, { timestamps: true });


const Customer = models?.Customer || model('Customer', CustomerSchema)
export default Customer 