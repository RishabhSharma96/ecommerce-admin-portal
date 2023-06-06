"use client"

import Image from "next/image"
import logo from "@public/logo.png"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Navbar from "@components/Navbar"
import { toast } from "react-hot-toast"
import axios from "axios"
import { BeatLoader } from "react-spinners"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"


const HomePage = ({ children }) => {

    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const [products, setProducts] = useState(0)
    const [categories, setCategories] = useState(0)
    const [admins, setAdmins] = useState(0)
    const [orders, setOrders] = useState([])
    const [customers, setCustomers] = useState(0)
    const [items, setitems] = useState(0)
    const [price, setprice] = useState(0)
    const [paid, setpaid] = useState(0)
    const [unpaid, setunpaid] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, [])

    useEffect(() => {
        const get = async () => {
            await axios.get("/api/product").then((response) => {
                setProducts(response.data.length)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        get();
    }, [])

    useEffect(() => {
        const getC = async () => {
            await axios.get("/api/category").then((response) => {
                setCategories(response.data.length)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        getC();
    }, [])

    useEffect(() => {
        const geta = async () => {
            await axios.get("/api/utilities/admin").then((response) => {
                setAdmins(response.data.length)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        geta();
    }, [])

    useEffect(() => {
        const getcu = async () => {
            await axios.get("/api/customer").then((response) => {
                setCustomers(response.data.length)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        getcu();
    }, [])

    useEffect(() => {
        const geto = async () => {
            await axios.get("/api/orders").then(async (response) => {
                setOrders(response.data)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        geto();
    }, [])

    useEffect(() => {
        const geti = async () => {
            await axios.get("/api/orders/items").then((response) => {
                setitems(response.data.value)
                setprice(response.data.price)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        geti();
    }, [])

    useEffect(() => {
        const getpaidunpiaid = async () => {
            await axios.get("/api/orders/paidunpiad").then((response) => {
                console.log(response.data)
                setpaid(response.data.paid)
                setunpaid(response.data.unpaid)
            }).catch((err) => {
                console.log(err.messagde)
            })
        }
        getpaidunpiaid()
    }, [])


    if (!session) {
        return (<div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
            <motion.div
                transition={{ duration: 0.8 }}
                initial={{ opacity: 0, x: "+400px" }}
                animate={{ opacity: 1, x: "0px" }}
                exit={{ opacity: 0, x: "+400px" }}
                className="flex flex-col items-center justify-center">
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
                <a href="mailto:rishabhsharma96n@gmail.com?subject=Admin role wanted!!"><button className="bg-black h-[2.5rem] w-[12rem] mt-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition ease-in-out duration-500">
                    <span>Request Admin Access</span>
                </button></a>
            </motion.div>
        </div>)
    }

    else {
        return (
            <div >
                <div className="w-screen h-screen bg-blue-900 flex">
                    <Navbar />


                    <motion.div
                        className="bg-white flex-grow ml-[-10px] m-2 rounded-xl overflow-hidden overflow-y-scroll">
                        <div className="p-5 flex justify-between">
                            <div className="flex gap-2">
                                <span className="mt-[0.1rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mt-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </span>
                                <span className="text-blue font-bold text-md mt-2 md:text-xl text-blue-900">Welcome, {session.user.name}
                                </span>
                            </div>
                            <img className="h-10 w-10 rounded-full" src={session.user.image} alt="profile-picture" />
                        </div>

                        {!products && !categories && orders.length === 0 && !admins && !customers && !items && !price &&
                            (
                                <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                                    <BeatLoader color="rgba(39, 39, 184, 0.82)" />
                                </div>
                            )
                        }
                        {products && categories && orders.length > 0 && admins && customers && items && price && (
                            <div className="bg-white flex flex-col flex-grow ml-[-10px]rounded-xl p-5 gap-5 items-center justify-center ">

                                <p className='text-blue-900 font-extrabold text-2xl xl:text-3xl mb-3 '>Shop-It Analytics</p>


                                <div className="flex gap-5 flex-wrap justify-center items-center">
                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "+400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "+400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 to-indigo-200 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>

                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Products</span>
                                            <span className="text-3xl font-extrabold">{products}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "-400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "-400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                        </svg>


                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Category</span>
                                            <span className="text-3xl font-extrabold">{categories}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "+400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "+400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 to-indigo-200 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                        </svg>


                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Admins</span>
                                            <span className="text-3xl font-extrabold">{admins}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "-400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "-400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                                        </svg>




                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Orders</span>
                                            <span className="text-3xl font-extrabold">{orders.length}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "+400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "+400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 to-indigo-200 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>



                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Customers</span>
                                            <span className="text-3xl font-extrabold">{customers}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "-400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "-400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                        </svg>

                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Items Sold</span>
                                            <span className="text-3xl font-extrabold">{items}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "+400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "+400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 to-indigo-200 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>


                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Profit</span>
                                            <span className="text-3xl font-extrabold">{price}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "-400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "-400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                                        </svg>
                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Paid Orders</span>
                                            <span className="text-3xl font-extrabold">{paid}</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        transition={{ duration: 0.8 }}
                                        initial={{ opacity: 0, x: "+400px" }}
                                        animate={{ opacity: 1, x: "0px" }}
                                        exit={{ opacity: 0, x: "+400px" }}

                                        className="flex w-[15rem] h-[10rem] p-2 rounded-xl text-white  bg-gradient-to-r from-indigo-500 to-indigo-200 gap-5 justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>



                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-bold">Unpaid Order</span>
                                            <span className="text-3xl font-extrabold">{unpaid}</span>
                                        </div>
                                    </motion.div>

                                </div>

                            </div>
                        )}
                    </motion.div>


                </div>
            </div >
        )
    }
}

export default HomePage