'use client'

import Navbar from '@components/Navbar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { HashLoader } from "react-spinners"
import { ReactSortable } from 'react-sortablejs'
import { useParams, useRouter } from 'next/navigation'

const Page = () => {

    const [categoryData, setCategoryData] = useState(null)
    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productCategory, setProductCategory] = useState("")
    const [images, setImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    const router = useRouter()
    const params = useParams()
    const id = params.id

    const getProduct = async () => {
        await axios.get(`/api/product/${id}`).then((response) => {
            setProductName(response.data[0].productName)
            setProductDescription(response.data[0].productDescription)
            setImages(response.data[0].productImages)
            setProductPrice(response.data[0].productPrice)
            setProductCategory(response.data[0].productCategory._id)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    const getCategories = async () => {
        await axios.get("/api/category").then((response) => {
            setCategoryData(response.data)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        getProduct()
    }, [])

    const uploadImages = async (e) => {

        if (images.length > 4) {
            console.log("max")
            return
        }

        const files = e.target.files;
        const formData = new FormData();

        for (const file of files) {
            formData.append("file", file);
            formData.append("upload_preset", "socioscape")
        }

        setIsUploading(true);
        const data = await axios
            .post("https://api.cloudinary.com/v1_1/digqsa0hu/image/upload",
                formData
            )
            .then((response) => {
                console.log(response.data.secure_url)
                setImages([...images, response.data.secure_url]);
                console.log(images)
            })
            .catch((error) => {
                console.error("Error: ", error);
            })
            .finally(() => setIsUploading(false));
    }

    const EditProduct = async () => {
        console.log(productName, productCategory, productDescription, images, productPrice)
        await axios.put(`/api/product/edit/${id}`,{
            productName,
            productDescription,
            images,
            productPrice,
            productCategory
        }).then((response)=>{
            console.log(response)
            router.push("/products")
        }).catch((err)=>{
            console.log(err.message)
        })
    }

    const updateOrder = (images) => {
        console.log(images)
        setImages(images)
    }

    return (
        <div>
            <div className="w-screen h-screen bg-blue-900 flex">
                <Navbar />
                <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center">
                    <span className='text-blue-900 font-extrabold text-3xl mb-3'>Add New Product</span>
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <label className='text-blue-900 font-bold'>Product Name</label>
                        <input
                            className='h-10 w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500'
                            type="text"
                            placeholder='Enter Product Name'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2 items-center justify-center'>
                        <label className='text-blue-900 font-bold'>Product Images<span className='text-gray-400 font-semibold text-sm'>&nbsp;(max 5)</span></label>
                        <div className='flex gap-2'>
                            <button className='flex flex-col justify-center items-center gap-3'>
                                <label className='cursor-pointer bg-gray-300 h-32 w-32 rounded-xl flex flex-col items-center justify-center text-gray-600 gap-2 font-bold'>
                                    Upload
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <input type="file" className='hidden' onChange={uploadImages} />
                                </label>
                            </button>
                            {isUploading && (
                                <div className='flex items-center justify-center'>
                                    <HashLoader color={"gray"} />
                                </div>
                            )}
                            <div className='flex gap-2'>
                                <ReactSortable className='flex gap-2' list={images} setList={updateOrder}>
                                    {images.length > 0 ? (<>
                                        {images.map((image) => {
                                            return (
                                                <img className='w-32 h-32 rounded-xl object-contain' src={image} alt="product-image" />
                                            )
                                        })}
                                    </>) : ""}
                                </ReactSortable>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <label className='text-blue-900 font-bold'>Product Description</label>
                        <textarea
                            className='h-[2.6rem] w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 resize-none'
                            type="text"
                            placeholder='Enter Product Description'
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <label className='text-blue-900 font-bold'>Choose Product Category</label>
                        <select value={productCategory} className='h-10 w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 appearance-none' onChange={(e) => setProductCategory(e.target.value)}>
                            <option selected className='pr-3 text-grey-500' value="0">Select Category</option>
                            {categoryData?.length > 0 &&
                                categoryData.map((category) => {
                                    return (
                                        <option className='pr-3 text-grey-500' value={category._id}>{category.categoryName}</option>
                                    )
                                })}
                        </select>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <label className='text-blue-900 font-bold'>Price</label>
                        <input
                            className='h-10 w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 [appearance-textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            type="number"
                            placeholder='Enter Product Price'
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                    </div>
                    <button className='h-10 bg-blue-900 w-[12rem] rounded-xl text-white font-bold hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300' onClick={EditProduct}>Edit Product</button>
                </div>
            </div>
        </div>
    )
}

export default Page