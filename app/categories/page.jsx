"use client"

import Navbar from '@components/Navbar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Metadata } from "next"

const Page = () => {


    const [categoryName, setCategoryName] = useState("")
    const [categoryData, setCategoryData] = useState([])
    const [parentCategory, setParentCategory] = useState(null)
    const [editData, setEditData] = useState(null)

    const createCategory = async () => {

        if (parentCategory === "0") {
            setParentCategory(null)
        }

        if (!editData) {
            await axios.post("/api/category/new", {
                categoryName,
                parentCategory
            }).then((response) => {
                setCategoryName("")
                setParentCategory(null)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        else {
            await axios.put(`/api/category/edit`, {
                categoryName,
                parentCategory,
                id: editData._id
            }).then((response) => {
                setCategoryName("")
                setParentCategory(null)
                setEditData(null)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        getCategories()
    }

    const editCategory = async (category) => {
        setEditData(category)
        setCategoryName(category.categoryName)
        setParentCategory(category?.parentCategory?._id)
    }

    const deleteCategory = async (category) => {
        await axios.delete(`/api/category/delete/${category._id}`).then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err.message)
        })
        getCategories()
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

    return (
        <div>
            <div className="w-screen h-screen bg-blue-900 flex">
                <Navbar />
                <div className="bg-white flex flex-col flex-grow ml-[-10px] m-2 rounded-xl p-5 gap-4 items-center justify-center">
                    <span className='text-blue-900 font-extrabold text-3xl mb-3'>Categories</span>
                    <label className='text-blue-900 font-bold text-xl'>{editData ? `Edit Category ${editData.categoryName}` : "Create New Category"}</label>
                    <div>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => { setCategoryName(e.target.value) }}
                            placeholder='Enter Category Name'
                            className='w-[350px] border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500'
                        />

                        <select value={parentCategory} className='w-[350px] border border-gray-600 h-10 pl-3 rounded-xl focus:outline-blue-500 ml-3 pr-3 appearance-none' onChange={(e) => setParentCategory(e.target.value)}>
                            <option selected className='pr-3 text-grey-500' value={null}>Select Parent Category</option>
                            {categoryData?.length > 0 &&
                                categoryData.map((category) => {
                                    return (
                                        <option className='pr-3 text-grey-500' value={category._id}>{category.categoryName}</option>
                                    )
                                })}
                        </select>

                        {!editData ? (
                            <button className='w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl ml-3 hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300' onClick={createCategory}>Create</button>
                        ) : (
                            <button className='w-[200px] bg-blue-900 text-white font-bold h-10 rounded-xl ml-3 hover:border hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all duration-300' onClick={createCategory}>Save</button>
                        )}



                    </div>
                    <div className='border border-gray-600 w-[920px] rounded-xl p-1'>
                        <div className='bg-blue-900 text-white flex items-center h-12 justify-center font-bold text-xl rounded-t-xl'>Availaible Categories</div>
                        <div>
                            <div className="flex mb-1">
                                <div className='w-[50%] flex flex-col gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                    Category
                                </div>
                                <div className='w-[50%] flex flex-col gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l items-center'>
                                    Parent Category
                                </div>
                                <div className='w-[50%] flex gap-2 p-3 pl-5 bg-blue-600 text-white font-bold text-l justify-center'>
                                    Options
                                </div>
                            </div>
                            {categoryData.length > 0 && categoryData.map((category) => {
                                return (
                                    <div className="flex">
                                        <div className='w-[50%] flex flex-col gap-2 pl-5 items-center justify-center'>
                                            {category.categoryName}
                                        </div>
                                        <div className='w-[50%] flex gap-2 flex-col pl-5 items-center justify-center text-gray-400'>
                                            {category?.parentCategory === "0" ? "" : category.parentCategory?.categoryName}
                                        </div>
                                        <div className='w-[50%] flex pl-5 items-center gap-2 justify-center'>
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
                </div>
            </div>
        </div>
    )
}

export default Page