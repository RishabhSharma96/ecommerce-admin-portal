import Product from "@models/product";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {

    const { productName,
        productDescription, productPrice, images, productCategory, properties } = await req.json()


    try {

        const noOdDocs = await Product.count()

        await connectToDB()
        const data = new Product({
            productName,
            productDescription,
            productCategory : productCategory === "" ? undefined : productCategory,
            productImages: images,
            productPrice,
            properties,
            promoted: noOdDocs === 0 ? true : false
        })
        const response = await data.save()
        return new Response(JSON.stringify(response), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}