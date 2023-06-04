"use client"

import Navbar from '@components/Navbar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getProviders, useSession, signIn, signOut } from 'next-auth/react'
import Image from "next/image"
import logo from "@public/logo.png"
import { toast } from 'react-hot-toast'
import { withSwal } from 'react-sweetalert2'
import { BeatLoader } from 'react-spinners'

const Page = ({ swal }) => {

    const { data: session } = useSession();

    const [categoryName, setCategoryName] = useState("")
    const [categoryData, setCategoryData] = useState([])
    const [parentCategory, setParentCategory] = useState("")
    const [editData, setEditData] = useState(null)
    const [properties, setProperties] = useState([])
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }
        setUpProviders();
    }, [])

    const createCategory = async () => {

        if (!categoryName) {
            toast.error("Category name cannot be null")
            return
        }

        if (!editData) {
            await axios.post("/api/category/new", {
                categoryName,
                parentCategory,
                properties: properties.map(p => ({
                    name: p.name,
                    values: p.values.split(",")
                }))
            }).then((response) => {
                setCategoryName("")
                setParentCategory("")
                toast.success(`${categoryName} added`)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        else {

            if (!categoryName || !parentCategory) {
                toast.error("Category name cannot be null")
                return
            }

            await axios.put(`/api/category/edit`, {
                categoryName,
                parentCategory,
                properties: properties.map(p => ({
                    name: p.name,
                    values: p.values.split(",")
                })),
                id: editData._id
            }).then((response) => {
                setCategoryName("")
                setParentCategory("")
                setEditData(null)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        setProperties([])
        getCategories()
    }

    const editCategory = async (category) => {
        setEditData(category)
        setCategoryName(category.categoryName)
        setParentCategory(category?.parentCategory?._id)
        setProperties(category.properties.map(({ name, values }) => ({
            name,
            values: values.join(",")
        })))
    }

    const deleteCategory = async (category) => {

        swal.fire({
            title: 'Are You Sure?',
            text: 'Confirm delete ' + category.categoryName,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55',

        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete(`/api/category/delete/${category._id}`).then((response) => {
                    // console.log(response)
                    toast.success(`${category.categoryName} deleted`)
                }).catch((err) => {
                    console.log(err.message)
                })
                getCategories()
            }
        }).catch(error => {
            toast.error(err.message)
        });
    }

    const getCategories = async () => {
        await axios.get("/api/category").then((response) => {
            setCategoryData(response.data)
            console.log(response)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getCategories()
    }, [])

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, { name: "", values: "" }]
        })
    }

    const handlePropertynameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }

    const handlePropertyValueChange = (index, property, newValue) => {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValue
            return properties
        })
    }

    const handeRemoveProperty = (indextoRemove) => {
        setProperties(prev => {
            return [...prev].filter((p, pi) => {
                return pi != indextoRemove
            })
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
                    {!categoryData.length &&
                        (
                            <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center overflow-hidden overflow-y-scroll">
                                <BeatLoader color="rgba(39, 39, 184, 0.82)" />
                            </div>
                        )
                    }
                    {
                        categoryData.length > 0 && (

                            <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-10 xl:gap-4 items-center overflow-hidden overflow-y-scroll">
                                <span className='text-blue-900 font-extrabold text-3xl mb-3'>Categories</span>
                                <div className='border-2 border-gray-300 p-3 gap-2 rounded-xl flex flex-col justify-center items-center xl:w-[900px]'>
                                    <label className='text-blue-900 font-bold text-xl'>{editData ? `Edit Category "${editData.categoryName}"` : "Create New Category"}</label>
                                    <div className='flex flex-col lg:flex-row lg:gap-3'>
                                        <input
                                            type="text"
                                            value={categoryName}
                                            onChange={(e) => { setCategoryName(e.target.value) }}
                                            placeholder='Enter Category Name'
                                            className='mr-2 lg:mr-0 xl:w-[350px] w-[230px] border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500'
                                        />

                                        <select value={parentCategory} className='mt-2 w-[230px] lg:mt-0 xl:w-[350px] border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500 xl:ml-3 pr-3 appearance-none' onChange={(e) => setParentCategory(e.target.value)}>
                                            <option selected className='pr-3 text-grey-500' value="">Select Parent Category</option>
                                            {categoryData?.length > 0 &&
                                                categoryData.map((category) => {
                                                    return (
                                                        <option key={category._id} className='pr-3 text-grey-500' value={category._id}>{category.categoryName}</option>
                                                    )
                                                })}
                                        </select>



                                    </div>
                                    <div className='flex flex-col gap-2 items-center justify-center'>
                                        <label className='text-blue-900 font-bold text-xl'>{editData ? `Edit Property "${editData.categoryName}"` : "Create New Property"}</label>

                                        {properties.length > 0 && properties.map((property, index) => {
                                            return (
                                                <div className='flex flex-col lg:flex-row lg:gap-3 items-center' key={"d"}>

                                                    <input
                                                        type="text"
                                                        className='mr-2 lg:mr-0 xl:w-[350px] w-[230px] border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500'
                                                        placeholder='Property name (ex:color)'
                                                        value={property.name}
                                                        onChange={e => handlePropertynameChange(index, property, e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className='xl:w-[350px] w-[230px] mt-2 lg:mt-0 border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500'
                                                        placeholder='Values (comma seperated)'
                                                        value={property.values}
                                                        onChange={e => handlePropertyValueChange(index, property, e.target.value)}
                                                    />
                                                    <button onClick={() => handeRemoveProperty(index)}>
                                                        <svg className='mt-2 xl:mt-0 h-[40px] text-red-600' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )
                                        })
                                        }
                                        <button onClick={addProperty} className='w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300 flex items-center justify-center gap-3'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                            Add Properties</button>

                                    </div>
                                </div>
                                <div>{!editData ? (
                                    <button className='mt-2 mb-2 xl:mb-0 xl:mt-0 w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300 flex items-center justify-center gap-3' onClick={createCategory}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>

                                        Create</button>

                                ) : (
                                    <div>
                                        <button className='mt-2 mb-2 xl:mb-0 xl:mt-0 w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300' onClick={createCategory}>Save</button>
                                    </div>

                                )}
                                    {editData && <button className='w-[200px] bg-red-700 text-white font-bold h-10 rounded-xl hover:border hover:border-red-700 hover:text-red-700 hover:bg-white transition-all duration-300 mt-3'
                                        onClick={() => {
                                            setEditData(null)
                                            setCategoryName("")
                                            setParentCategory("")
                                            setProperties([])
                                        }}
                                    >
                                        Cancel
                                    </button>}
                                </div>

                                {!editData && (
                                    <div className='min-w-[250px] border border-gray-600 w-[78%] rounded-xl lg:p-1'>
                                        <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>Availaible Categories</div>
                                        <div>
                                            <div className="flex mb-1">
                                                <div className='w-[33.334%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                                    Category
                                                </div>
                                                <div className='w-[33.333%] flex flex-col gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                                    Parent Category
                                                </div>
                                                <div className='w-[33.333%] flex gap-0 lg:gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l justify-center'>
                                                    Options
                                                </div>
                                            </div>
                                            {categoryData.length > 0 && categoryData.map((category) => {
                                                return (
                                                    <div key={category._id} className="flex">
                                                        <div className='w-[33.33%] flex flex-col gap-0 lg:gap-2 pl-5 items-center justify-center'>
                                                            {category.categoryName}
                                                        </div>
                                                        <div className='w-[33.33%] flex gap-0 lg:gap-2 flex-col pl-5 items-center justify-center text-gray-400'>
                                                            {category?.parentCategory === "0" ? "" : category.parentCategory?.categoryName}
                                                        </div>
                                                        <div className='w-[33.33%] flex pl-5 items-center gap-[-2] lg:gap-2 justify-center ml-[-10px] md:ml-0'>
                                                            <button onClick={() => { deleteCategory(category) }}>
                                                                <svg className='h-[40px] text-red-600' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={() => editCategory(category)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[40px] text-green-800">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                </svg>
                                                            </button>
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
}

// export default Page

export default withSwal(({ swal }, ref) => (
    <Page swal={swal} />
))