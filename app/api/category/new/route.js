import Category from "@models/category";
import { connectToDB } from '@lib/mongoose';
import mongoose from "mongoose";
import { ObjectId } from "mongodb"

export const POST = async (req) => {

    const { categoryName, parentCategory, properties } = await req.json()


    try {
        await connectToDB()
        const data = new Category({
            categoryName,
            parentCategory: parentCategory === "" ? undefined : parentCategory,
            properties
        })
        const response = await data.save()
        return new Response(JSON.stringify(response), { status: 201 })
    }
    catch (err) {
        console.log(err.message)
        return new Response(JSON.stringify(err), { status: 501 })
    }
}