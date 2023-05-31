import Category from "@models/category";
import { connectToDB } from "@utils/database";

export const DELETE = async (req, { params }) => {

    const _id = params.id

    try {
        await connectToDB()
        await Category.deleteOne({ _id })
        return new Response(JSON.stringify('ok'), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}