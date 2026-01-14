import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <section className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
      <div>
        <img
          src={assets.exchange_icon}
          className='w-12 m-auto mb-5'
          alt="Easy product exchange policy"
        />
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>
          Hassle-free exchange on eligible products
        </p>
      </div>

      <div>
        <img
          src={assets.quality_icon}
          className='w-12 m-auto mb-5'
          alt="7 days return policy"
        />
        <p className='font-semibold'>7 Days Return Policy</p>
        <p className='text-gray-400'>
          Free returns within 7 days of delivery
        </p>
      </div>

      <div>
        <img
          src={assets.support_img}
          className='w-12 m-auto mb-5'
          alt="Customer support assistance"
        />
        <p className='font-semibold'>Customer Support</p>
        <p className='text-gray-400'>
          Dedicated support from 10 AM to 7 PM
        </p>
      </div>

    </section>
  )
}

export default OurPolicy
