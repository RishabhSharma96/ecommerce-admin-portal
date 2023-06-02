"use client"

import Image from "next/image"
import logo from "@public/logo.png"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Navbar from "@components/Navbar"
import { toast } from "react-hot-toast"

const HomePage = ({ children }) => {

    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
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
            < >
                <div className="w-screen h-screen bg-blue-900 flex">
                    <Navbar />
                    <div className="bg-white flex-grow ml ml-[-10px] m-2 rounded-xl">
                        <div className="p-5 flex justify-between">
                            <div className="flex gap-2">
                                <span className="mt-[0.1rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </span>
                                <span className="text-blue font-bold text-xl text-blue-900">Welcome, {session.user.name}
                                </span>
                            </div>
                            <img className="h-10 w-10 rounded-full" src={session.user.image} alt="profile-picture" />
                        </div>
                    </div>
                </div>
            </ >
        )
    }
}

export default HomePage