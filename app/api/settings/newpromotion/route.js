import Product from "@models/product";
import { connectToDB } from '@lib/mongoose';
export const PATCH = async (req) => {

    try {
        await connectToDB()

        const { newPromotedProductId, prePromotedProductId } = await req.json()

        const oldPromotion = await Product.updateOne({ _id: prePromotedProductId }, {
            promoted: false
        })

        const newPromotion = await Product.updateOne({ _id: newPromotedProductId }, {
            promoted: true
        })

        return new Response(JSON.stringify(newPromotion), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}