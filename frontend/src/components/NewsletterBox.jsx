import React, { useState } from 'react'

const NewsletterBox = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    // future: API call here
    setSuccess(true)
    setEmail('')
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>
        Subscribe now & get 20% off
      </p>

      <p className='text-gray-400 mt-3'>
        Subscribe to our newsletter and be the first to know about new arrivals,
        exclusive offers, and special discounts.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'
      >
        <label htmlFor="email" className="sr-only">
          Email address
        </label>

        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          className='w-full sm:flex-1 outline-none'
        />

        <button
          className='bg-black text-white text-xs px-10 py-4'
          type='submit'
        >
          SUBSCRIBE
        </button>
      </form>

      {success && (
        <p className='text-green-600 text-sm'>
          Thanks for subscribing! 🎉
        </p>
      )}
    </div>
  )
}

export default NewsletterBox
