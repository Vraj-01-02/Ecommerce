import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='flex flex-col sm:flex-row border border-gray-300'>
      
      {/* Hero Left */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-gray-700'>
          
          <div className='flex items-center gap-2'>
            <span className='w-8 md:w-11 h-0.5 bg-gray-700'></span>
            <p className='font-medium text-sm md:text-base uppercase'>
              Our Bestsellers
            </p>
          </div>

          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
            Latest Arrivals
          </h1>

          <Link
            to="/collection"
            className='inline-flex items-center gap-2 font-semibold text-sm md:text-base mt-2 hover:gap-3 transition-all'
          >
            SHOP NOW
            <span className='w-8 md:w-11 h-px bg-gray-700'></span>
          </Link>

        </div>
      </div>

      {/* Hero Right */}
      <img
        className='w-full sm:w-1/2 object-cover'
        src={assets.hero_img}
        alt="Latest fashion arrivals for men, women and kids"
      />
    </section>
  )
}

export default Hero
