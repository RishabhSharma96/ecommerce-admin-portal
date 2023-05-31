import Product from "@models/product";
import { connectToDB } from "@utils/database";

export const PUT = async (req, {params}) => {

    const id = params.id

    const { productName, productDescription, images, productPrice, productCategory } = await req.json()

    try {
        await connectToDB()
        const data = await Product.updateOne({_id: id}, {
            productName,
            productCategory,
            productDescription,
            productImages : images,
            productPrice
        })
        // const response = await data.save()
        return new Response(JSON.stringify(data), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}