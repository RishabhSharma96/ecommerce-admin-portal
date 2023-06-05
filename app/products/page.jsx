'use client'

import Navbar from '@components/Navbar'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Image from "next/image"
import logo from "@public/logo.png"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast'
import {
    BeatLoader
} from 'react-spinners'
import { motion } from 'framer-motion'

const Page = () => {

    const router = useRouter()
    const [productData, setProductData] = useState([])

    const getProducts = async () => {
        await axios.get("/api/product").then((response) => {
            console.log(response.data);
            setProductData(response.data)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getProducts()
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

    const deleteProduct = async (product) => {
        Swal.fire({
            title: 'Are You Sure?',
            text: 'Confirm delete ' + product.productName,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55',

        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete(`/api/product/delete/${product._id}`).then((response) => {
                    getProducts()
                    toast.success(`${product.productName} deleted`)
                }).catch((err) => {
                    console.log(err.message)
                })
            }
        }).catch(error => {
            toast.error(err.message)
        });

    }

    if (!session) {
        return (<div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <Image src={logo} width={250} height={250} alt="Company logo" />
                <span className="text-white font-bold text-lg">Welcome to Shop-it Admin Portal</span>
                <button key={providers?.name} onClick={async () => {
                    await signIn('google')
                    toast.success("Logged In")
                }} className="bg-white h-[2.5rem] w-[12rem] mt-5 rounded-lg text-blue-900 font-bold flex items-center justify-center gap-2">
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
                    {!productData.length &&
                        (
                            <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                                <BeatLoader
                                    color="rgba(39, 39, 184, 0.82)" />
                            </div>
                        )
                    }
                    {productData.length > 0 && (
                        <motion.div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center overflow-hidden overflow-y-scroll">
                            <span className='text-blue-900 font-extrabold text-3xl mb-3'>Products</span>
                            <button className='h-10 bg-blue-900 w-[12rem] rounded-xl text-white font-bold hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300 flex items-center justify-center gap-3' onClick={() => router.push("/products/new")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                                Add new Product</button>
                            <motion.div

                                transition={{ duration: 0.8 }}
                                initial={{ opacity: 0, x: "-400px" }}
                                animate={{ opacity: 1, x: "0px" }}
                                exit={{ opacity: 0, x: "-400px" }}

                                className=' min-w-[260px] border border-gray-600 w-[80%] rounded-xl p-1'>
                                <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>Availaible Products</div>
                                <div>
                                    <div className="flex mb-1">
                                        <div className='w-[33.33%] lg:w-[50%] flex flex-col gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                            Product Name
                                        </div>
                                        <div className='hidden lg:flex w-[50%] flex flex-col gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                            Price
                                        </div>
                                        <div className='w-[33.33%] lg:w-[50%] flex gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l justify-center'>
                                            Category
                                        </div>
                                        <div className='w-[33.33%] lg:w-[50%] flex gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l justify-center'>
                                            Options
                                        </div>
                                    </div>
                                    {productData.length > 0 && productData.map((product) => {
                                        return (
                                            <div key={product._id} className="flex">
                                                <div className='w-[33.33%] lg:w-[50%] flex flex-col gap-2 pl-5 items-center justify-center'>
                                                    {product.productName}
                                                </div>
                                                <div className='hidden lg:flex w-[50%] flex gap-2 flex-col pl-5 items-center justify-center text-gray-400'>
                                                    ₹{product.productPrice}
                                                </div>
                                                <div className='w-[33.33%] lg:w-[50%] flex flex-col gap-2 pl-5 items-center justify-center'>
                                                    {product?.productCategory ? product.productCategory.categoryName : ""}
                                                </div>
                                                <div className='ml-[-7px] md:ml-0 w-[33.33%] lg:w-[50%] flex pl-5 items-center md:gap-2 justify-center'>
                                                    <button onClick={() => deleteProduct(product)}>
                                                        <svg className='h-[40px] text-red-600' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => router.push(`/products/edit/${product._id}`)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[40px] text-green-800">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>)
                    }
                </div>
            </div >
        )
    }
}

export default Page 