import { Schema, models, model } from "mongoose";

const ShippingSchema = new Schema({
    shippingPrice: {
        type: Number,
    }
});


const Shipping = models.Shipping || model('Shipping', ShippingSchema)
export default Shipping 