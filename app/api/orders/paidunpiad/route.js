import Order from "@models/order";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {

    try {
        await connectToDB()
        // const paiddata = await Order.find()
        const paiddata = await Order.find({paid : true})
        const unpaiddata = await Order.find({paid : false})

        // console.log(paiddata)
        // console.log("dfgdfgdg")
        // // console.log(unpaiddata)

        return new Response(JSON.stringify({
            paid : paiddata.length,
            unpaid : unpaiddata.length,
        }), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}