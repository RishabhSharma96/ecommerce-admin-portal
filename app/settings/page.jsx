'use client'

import Navbar from '@components/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getProviders, useSession, signIn, signOut } from 'next-auth/react'
import Image from "next/image"
import logo from "@public/logo.png"
import { toast } from 'react-hot-toast'

const Page = () => {

    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);

    const [prePromotedProduct, setPrePromotedProduct] = useState([])
    const [prePromotedProductId, setPrePromotedProductId] = useState(null)
    const [newPromotedProductId, setNewPromotedProductId] = useState(null)
    const [productData, setProductData] = useState(null)
    const [currentshippingDetails, setCurrrentShippingDetails] = useState({})
    const [newShippingPrice, setNewShippingPrice] = useState(0)

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, [])

    const getPromotedProduct = async () => {
        await axios.get("/api/settings/promoted").then((response) => {
            setPrePromotedProduct(response.data)
            setPrePromotedProductId(response.data[0]._id)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getPromotedProduct()
    }, [])

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

    const handleproductupdation = async () => {

        if (!newPromotedProductId) {
            toast.error("null cannot be promoted")
            return
        }

        await axios.patch("/api/settings/newpromotion", {
            newPromotedProductId,
            prePromotedProductId
        }).then((response) => {
            setPrePromotedProductId(null)
            setNewPromotedProductId(null)
            getPromotedProduct()
            getProducts()
            toast.success("New product promoted")
        }).catch((err) => {
            console.log(err.message)
        })

    }

    const getShippingDetails = async () => {
        await axios.get("/api/settings/shipping").then((response) => {
            setCurrrentShippingDetails(response.data)
            setNewShippingPrice(response.data[0].shippingPrice)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getShippingDetails()
    }, [])

    const UpdateShippingPrice = async () => {

        console.log(newShippingPrice, currentshippingDetails[0]._id)

        await axios.patch("/api/settings/shipping/update", {
            currentshippingPrice: newShippingPrice,
            id: currentshippingDetails[0]._id
        }).then((response) => {
            getShippingDetails()
            toast.success("Shipping price setted to " + newShippingPrice)
        }).catch((err) => {
            console.log(err.message)
        })
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
                    <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-8 lg:p-10 gap-3 xl:gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                        <p className='text-blue-900 font-extrabold text-2xl xl:text-3xl mb-3 '>Shop-It Settings</p>
                        {
                            prePromotedProduct && (
                                <div className='min-w-[250px] border border-gray-600 w-[60%] rounded-xl lg:p-1'>
                                    <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>Promoted Product</div>
                                    <div>
                                        <div className="flex mb-1">
                                            <div className='w-[60%] flex flex-col gap-0 lg:gap-2 p-3 bg-blue-600 text-white font-bold text-l items-center'>
                                                Product
                                            </div>
                                            <div className='w-[40%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center pr-3'>
                                                Category
                                            </div>
                                        </div>
                                        {prePromotedProduct && prePromotedProduct.map((product, index) => {
                                            return (
                                                <div key={product._id} className="flex">
                                                    <div className='w-[60%] flex gap-0 lg:gap-2 flex-col text-center justify-center overflow-hidden'>
                                                        {product.productName}
                                                    </div>
                                                    <div className='w-[40%] flex gap-0 lg:gap-2 flex-col text-center justify-center overflow-hidden text-gray-500'>
                                                        {product.productCategory.categoryName}
                                                    </div>

                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        }

                        <div className='flex flex-col justify-center items-center gap-3'>
                            <label className='text-blue-900 font-bold'>Select Product to be promoted</label>
                            <select value={newPromotedProductId} className='h-10 w-[250px] md:w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 appearance-none' onChange={(e) => setNewPromotedProductId(e.target.value)}>
                                <option value="">Choose Product</option>
                                {productData?.length > 0 &&
                                    productData.map((product) => {
                                        return (
                                            <option key={product._id} className='pr-3 text-grey-500' value={product._id}>{product.productName}</option>
                                        )
                                    })}
                            </select>
                        </div>
                        <button onClick={handleproductupdation} className='w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300 flex gap-3 items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                            </svg>

                            Set Product</button>

                        <input
                            className='h-10 w-[250px] md:w-[400px] border border-gray-500 rounded-xl p-2 pl-4 focus:outline-blue-500 [appearance-textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            type="number"
                            placeholder='Enter Shipping Price'
                            value={newShippingPrice}
                            onChange={e => setNewShippingPrice(e.target.value)}
                        />
                        <button onClick={UpdateShippingPrice} className='w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300 flex gap-3 items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>

                            Set Shipping Price</button>

                    </div>
                </div>
            </div>
        )
    }
}

export default Page