import Category from "@models/category";
import { connectToDB } from "@utils/database";

export const PUT = async (req) => {

    const { categoryName, parentCategory, id } = await req.json()

    try {
        await connectToDB()
        const data = await Category.updateOne({_id: id}, {
            categoryName,
            parentCategory
        })
        // const response = await data.save()
        return new Response(JSON.stringify(data), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}