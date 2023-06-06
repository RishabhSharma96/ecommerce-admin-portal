'use client'

import Navbar from '@components/Navbar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getProviders, useSession, signIn, signOut } from 'next-auth/react'
import Image from "next/image"
import logo from "@public/logo.png"
import { toast } from 'react-hot-toast'
import { BeatLoader } from 'react-spinners'
import { motion } from 'framer-motion'

const Page = () => {

    const { data: session } = useSession();

    const [providers, setProviders] = useState(null);
    const [orderData, setOrderData] = useState([])

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, [])

    useEffect(() => {
        const getData = async () => {
            await axios.get("/api/orders").then((response) => {
                setOrderData(response.data)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        getData();
    }, [])

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
                    {!orderData.length &&
                        (
                            <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                                <BeatLoader color="rgba(39, 39, 184, 0.82)" />
                            </div>
                        )
                    }
                    {orderData.length > 0 && (
                        <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-10 xl:gap-4 items-center overflow-hidden overflow-y-scroll">
                            <span className='text-blue-900 font-extrabold text-3xl mb-3'>Orders</span>
                            <motion.div
                                transition={{ duration: 0.8 }}
                                initial={{ opacity: 0, x: "+400px" }}
                                animate={{ opacity: 1, x: "0px" }}
                                exit={{ opacity: 0, x: "+400px" }}
                                className='min-w-[250px] border border-gray-600 w-[78%] rounded-xl lg:p-1'>
                                <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>All Orders</div>
                                <div>
                                    <div className="flex mb-1">
                                        <div className='w-[20%] xl:w-[20%] flex flex-col gap-0 lg:gap-2 bg-blue-600 text-white font-bold text-l items-center justify-center'>
                                            Date
                                        </div>
                                        <div className='w-[40%] xl:w-[40%] flex flex-col gap-0 lg:gap-2 p-3 bg-blue-600 text-white font-bold text-l items-center justify-center '>
                                            Recipient
                                        </div>
                                        <div className='w-[40%] xl:w-[40%] flex gap-0 lg:gap-2 p-3 bg-blue-600 text-white font-bold text-l justify-center items-center'>
                                            Products
                                        </div>
                                    </div>
                                    {orderData.length > 0 && orderData.map((order) => {
                                        return (
                                            <div key={order._id} className="flex">
                                                <div className=' w-[20%] xl:w-[20%] flex flex-col gap-0 lg:gap-2 items-center justify-center pl-1'>
                                                    {order.createdAt.split('T')[0]}
                                                </div>
                                                <div className='w-[40%] xl:w-[40%]  flex flex-col gap-0 lg:gap-2 items-center justify-center'>
                                                    {order.name}
                                                </div>
                                                <div className='w-[40%] xl:w-[40%] flex flex-col gap-0 lg:gap-2 items-center justify-center'>
                                                    {
                                                        order.line_items.map((items,index) => {
                                                            return (
                                                                <div key={items?.price_data?.product_data?.name}>
                                                                    {items.quantity} x {items.price_data.product_data.name}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <hr className='bg-blue-900 h-2'></hr>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Page