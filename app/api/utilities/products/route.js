import Product from "@models/product";
import { connectToDB } from "@utils/database";

export const DELETE = async (req) => {

    try {
        await connectToDB()
        const data = await Product.collection.drop()
        return new Response(JSON.stringify(data), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}