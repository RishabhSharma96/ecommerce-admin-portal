import Category from "@models/category";
import { connectToDB } from '@lib/mongoose';
export const DELETE = async (req) => {

    try {
        await connectToDB()
        const data = await Category.collection.drop()
        return new Response(JSON.stringify(data), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}