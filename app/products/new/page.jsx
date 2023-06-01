'use client'

import Navbar from '@components/Navbar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { HashLoader } from "react-spinners"
import { ReactSortable } from 'react-sortablejs'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import logo from "@public/logo.png"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

const Page = () => {

    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productCategory, setProductCategory] = useState("")
    const [categoryData, setCategoryData] = useState([])
    const [images, setImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [productProperties, setProductProperties] = useState({})

    const router = useRouter()

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

    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
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
        const data = await axios.post('https://api.cloudinary.com/v1_1/digqsa0hu/image/upload',
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

    const addProduct = async () => {
        console.log(productName, productCategory, productDescription, images, productPrice)
        await axios.post('/api/product/new', {
            productName,
            productDescription,
            images,
            productPrice,
            productCategory,
            properties: productProperties
        }).then((response) => {
            console.log(response)
            router.push("/products")
        }).catch((err) => {
            console.log(err.message)
        })
    }

    const updateOrder = (images) => {
        console.log(images)
        setImages(images)
    }

    const showableProperties = []

    if (categoryData?.length > 0 && productCategory) {
        let temp = categoryData.find(({ _id }) => _id === productCategory)
        showableProperties.push(...temp?.properties)
        while (temp?.parentCategory?._id) {
            const parentinfo = categoryData.find(({ _id }) => _id === temp?.parentCategory?._id)
            showableProperties.push(...parentinfo?.properties)
            temp = parentinfo
        }
    }

    const handlePropertyChange = (name, value) => {
        setProductProperties(prev => {
            const newProductProps = { ...prev }
            newProductProps[name] = value
            return newProductProps
        })
    }

    if (!session) {
        return (<div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <Image src={logo} width={250} height={250} alt="Company logo" />
                <span className="text-white font-bold text-lg">Welcome to Shop-it Admin Portal</span>
                <button key={providers?.name} onClick={() => signIn('google')} className="bg-white h-[2.5rem] w-[12rem] mt-5 rounded-lg text-blue-900 font-bold flex items-center justify-center gap-2">
                    <span>
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
                    </span>
                    <div>
                        <span className="text-green-500">Sign </span>
                        <span className="text-blue-500">In </span>
                        <span className="text-yellow-500">With </span>
                        <span className="text-red-500">Google </span>
                    </div>
                </button>
                <button className="bg-black h-[2.5rem] w-[12rem] mt-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition ease-in-out duration-500">
                    <span>Request Admin Access</span>
                </button>
            </div>
        </div>)
    }
    else {
        return (
            <div>
                <div className="w-screen h-screen bg-blue-900 flex">
                    <Navbar />
                    <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center overflow-hidden overflow-y-scroll">
                        <span className='text-blue-900 font-extrabold text-3xl mb-3'>Add Product</span>
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <label className='text-blue-900 font-bold'>Product Name</label>
                            <input
                                className='h-10 w-[250px] md:w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500'
                                type="text"
                                placeholder='Enter Product Name'
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        {showableProperties.length > 0 && showableProperties.map(p => (
                            <div key={p} className='flex gap-2 mb-2 justify-between'>
                                <div className='text-gray-500'>{p.name}</div>
                                <select
                                    value={productProperties[p.name]}
                                    onChange={e => handlePropertyChange(p.name, e.target.value)} className='w-[160px] h-8 border border-gray-500 rounded-xl appearance-none pl-3 outline-gray-500'>
                                    {p.values.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
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
                                <div className='flex gap-2 flex-wrap'>
                                    <ReactSortable className='flex gap-2 flex-wrap' list={images} setList={updateOrder}>
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
                                className='h-[2.6rem] w-[250px] md:w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 resize-none'
                                type="text"
                                placeholder='Enter Product Description'
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <label className='text-blue-900 font-bold'>Choose Product Category</label>
                            <select className='h-10 w-[250px] md:w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 appearance-none' onChange={(e) => setProductCategory(e.target.value)}>
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
                                className='h-10 w-[250px] md:w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 [appearance-textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                type="number"
                                placeholder='Enter Product Price'
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                        </div>
                        <button className='h-10 bg-blue-900 w-[12rem] rounded-xl text-white font-bold hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300' onClick={addProduct}>Add Product</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Page