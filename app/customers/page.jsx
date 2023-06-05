'use client'

import Navbar from '@components/Navbar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

const Page = () => {

    const [customers, setCustomers] = useState([])

    useEffect(() => {
        const getCustomers = async () => {
            await axios.get("/api/customer").then((res) => {
                setCustomers(res.data)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        getCustomers()
    }, [])

    return (
        <div>
            <div className="w-screen h-screen bg-blue-900 flex">
                <Navbar />

                {!customers.length &&
                    (
                        <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                            <BeatLoader color="rgba(39, 39, 184, 0.82)" />
                        </div>
                    )
                }

                {customers.length > 0 && (

                    <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-10 xl:gap-4 items-center overflow-hidden overflow-y-scroll">
                        <span className='text-blue-900 font-extrabold text-3xl mb-3'>Customers</span>
                        {customers.length > 0 && (
                            <div className='min-w-[250px] border border-gray-600 w-[78%] rounded-xl lg:p-1'>
                                <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>Availaible Categories</div>
                                <div className='flex flex-col gap-2'>
                                    <div className="flex mb-1">
                                        <div className='w-[33.334%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l overflow-hidden'>
                                            Email
                                        </div>
                                        <div className='w-[33.333%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l overflow-hidden'>
                                            Phone
                                        </div>
                                        <div className='w-[33.333%] flex gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l justify-center'>
                                            Address
                                        </div>
                                    </div>
                                    {customers.length > 0 && customers.map((category) => {
                                        return (
                                            <div key={category._id} className="flex">
                                                <div className='w-[33.33%] flex flex-col gap-0 lg:gap-2 pl-5 justify-center overflow-hidden'>
                                                    {category.email}
                                                </div>
                                                <div className='w-[33.33%] flex gap-0 lg:gap-2 flex-col pl-5 overflow-hidden justify-center text-gray-400'>
                                                    {category.phoneNumber}
                                                </div>
                                                <div className='w-[33.33%] flex pl-5 items-center gap-[-2] lg:gap-2 overflow-hidden ml-[-10px] md:ml-0'>
                                                    {category.address}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>)}
            </div>
        </div>
    )
}

export default Page