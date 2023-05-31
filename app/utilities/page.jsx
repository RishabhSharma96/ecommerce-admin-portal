import Navbar from '@components/Navbar'
import React from 'react'

const page = () => {
    return (
        <div>
            <div className="w-screen h-screen bg-blue-900 flex">
                <Navbar />
                <div className="bg-white flex-grow ml ml-[-10px] m-2 rounded-xl">

                </div>
            </div>
        </div>
    )
}

export default page