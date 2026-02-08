import React, { useState } from 'react'
import userApi from '../utils/userApi'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await userApi.post('/api/user/forgot-password', { email })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Forgot Password</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            <input 
                type="email" 
                placeholder="Enter your email" 
                className='w-full px-3 py-2 border border-gray-800' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button className='bg-indigo-600 text-white font-medium px-8 py-2 mt-4 w-full rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95'>Submit</button>
        </form>
    )
}

export default ForgotPassword
