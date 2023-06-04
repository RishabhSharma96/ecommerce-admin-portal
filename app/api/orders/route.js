import Order from "@models/order";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {

    try {
        await connectToDB()
        const data = await Order.find().sort({createdAt: -1})
        return new Response(JSON.stringify(data), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}