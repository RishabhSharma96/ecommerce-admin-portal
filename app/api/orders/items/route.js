import Order from "@models/order";
import { connectToDB } from '@lib/mongoose';
export const GET = async (req) => {

    try {
        await connectToDB()
        const data = await Order.find()

        let value = 0
        let price = 0

        for (var i = 0; i < data.length; i++) {
            value += data[i].line_items[0].quantity
            price += data[i].line_items[0].price_data.unit_amount
        }

        return new Response(JSON.stringify({
            value: value,
            price: price
        }), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}