import Shipping from "@models/shipping";
import { connectToDB } from "@utils/database";

export const PATCH = async (req) => {

    const { currentshippingPrice, id } = await req.json()

    try {
        await connectToDB()
        const data = await Shipping.updateOne({ _id: id }, {
            shippingPrice: currentshippingPrice
        })
        // console.log(data)
        return new Response(JSON.stringify(data), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}