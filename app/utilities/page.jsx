"use client"

import Navbar from '@components/Navbar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getProviders, useSession, signIn, signOut } from 'next-auth/react'
import Image from "next/image"
import logo from "@public/logo.png"
import { toast } from 'react-hot-toast'
import {
    BeatLoader
} from 'react-spinners'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'

const Page = () => {

    const { data: session } = useSession();

    const [providers, setProviders] = useState(null);
    const [admin, setAdmin] = useState('')
    const [adminData, setAdminData] = useState([])

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, [])

    const handleCategoryClear = async () => {

        Swal.fire({
            title: 'Are You Sure?',
            text: 'This is a destructive action, Proceed?',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Proceed!',
            reverseButtons: true,
            confirmButtonColor: '#d55',

        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete("/api/utilities/category").then((response) => {
                    toast.success("Category Database cleared")
                }).catch((err) => {
                    console.log(err.message)
                })
            }
        }).catch(error => {
            toast.error(err.message)
        });


    }

    const handleProductClear = async () => {

        Swal.fire({
            title: 'Are You Sure?',
            text: 'This is a destructive action, Proceed?',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Proceed!',
            reverseButtons: true,
            confirmButtonColor: '#d55',

        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete("/api/utilities/products").then((response) => {
                    toast.success("Product Database cleared")
                }).catch((err) => {
                    console.log(err.message)
                })
            }
        }).catch(error => {
            toast.error(err.message)
        });
    }

    const handleAddAdmin = async () => {

        if (!admin) {
            toast.error("Admin e-mail cannot be empty")
            return
        }

        await axios.post("/api/utilities/admin/add", {
            email: admin
        }).then((response) => {
            setAdmin("")
            toast.success("Admin added")
        }).catch((err) => {
            console.log(err.message)
        })
        getAdmins()
    }

    const getAdmins = async () => {
        await axios.get("/api/utilities/admin",{
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires' : '0',
            }
        }).then((response) => {
            setAdminData(response.data)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    const handleAdminDelete = async (id) => {


        Swal.fire({
            title: 'Are You Sure?',
            text: 'Confirm delete ' + admin,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55',

        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete(`/api/utilities/admin/delete/${id}`)
                    .then((response) => {
                        getAdmins()
                        toast.success("Admin deleted")
                    }).catch((err) => {
                        console.log(err.message)
                    })
            }
        }).catch(error => {
            toast.error(err.message)
        });


    }

    useEffect(() => {
        getAdmins()
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
                    {!adminData.length &&
                        (
                            <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                                <BeatLoader
                                    color="rgba(39, 39, 184, 0.82)" />
                            </div>
                        )
                    }
                    {adminData.length > 0 && (
                        <motion.div
                            className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-10 gap-3 xl:gap-4 items-center overflow-hidden overflow-y-scroll">
                            <span className='text-blue-900 font-extrabold text-3xl mb-3'>Utilities</span>
                            <span className='text-blue-900 font-bold text-xl'>Clear All Products</span>
                            <button onClick={handleProductClear} className='w-[200px] bg-red-700 text-white font-bold h-10 rounded-xl hover:border hover:border-red-700 hover:text-red-700 hover:bg-white transition-all duration-300 flex justify-center items-center gap-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>

                                Delete Products</button>

                            <span className='text-blue-900 font-bold text-xl'>

                                Clear All Categories </span>
                            <button onClick={handleCategoryClear} className='w-[200px] bg-red-700 text-white font-bold h-10 rounded-xl hover:border hover:border-red-700 hover:text-red-700 hover:bg-white transition-all duration-300 flex justify-center items-center gap-4'>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>

                                Delete Catagories</button>

                            <span className='text-blue-900 font-bold text-xl'> Admins</span>
                            {
                                adminData.length > 0 && (
                                    <div className='min-w-[250px] border border-gray-600 w-[60%] rounded-xl lg:p-1'>
                                        <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>Availaible Admins</div>
                                        <div>
                                            <div className="flex mb-1">
                                                <div className='w-[80%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                                    Admin-id
                                                </div>
                                                <div className='w-[30%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center pr-3'>
                                                    Options
                                                </div>
                                            </div>
                                            {adminData.length > 0 && adminData.map((admin, index) => {
                                                return (
                                                    <motion.div
                                                        transition={{ duration: 0.8 }}
                                                        initial={{ opacity: 0, x: "+400px" }}
                                                        animate={{ opacity: 1, x: "0px" }}
                                                        exit={{ opacity: 0, x: "+400px" }}
                                                        key={admin._id} className="flex">

                                                        <div className='w-[80%] flex gap-0 lg:gap-2 flex-col pl-5 text-center justify-center overflow-hidden'>
                                                            {admin.email}
                                                        </div>
                                                        <div className='w-[30%] flex pl-5 items-center gap-[-2] lg:gap-2 justify-center ml-[-10px] md:ml-0 pr-2'>
                                                            <button onClick={() => handleAdminDelete(admin._id)}>
                                                                <svg className='h-[40px] text-red-600' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            }




                            <input
                                type="email"
                                placeholder='Enter e-mail to be added as admin'
                                className='mr-2 lg:mr-0 xl:w-[350px] w-[230px] border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500'
                                value={admin}
                                onChange={e => setAdmin(e.target.value)}
                            />
                            <button onClick={handleAddAdmin} className='w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300 flex justify-center items-center gap-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                                Add Admin</button>
                        </motion.div>
                    )}
                </div>
            </div >
        )
    }
}

export default Page