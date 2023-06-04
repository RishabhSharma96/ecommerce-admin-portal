import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema({
    line_items: {
        type: Object
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    pin: {
        type: Number
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    paid: {
        type: Boolean
    }

}, { timestamps: true });


const Order = models?.Order || model('Order', OrderSchema)
export default Order 