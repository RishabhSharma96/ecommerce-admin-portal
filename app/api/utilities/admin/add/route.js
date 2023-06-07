import Admin from "@models/admin";
import { connectToDB } from '@lib/mongoose';
export const POST = async (req) => {

    const { email } = await req.json()

    try {
        await connectToDB()
        const data = new Admin({
            email
        })
        const response = await data.save()
        return new Response(JSON.stringify(response), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}