import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>We bring you a curated collection of stylish and comfortable clothing designed
to match modern fashion trends. From everyday wear to special occasion outfits,our focus is on quality fabrics, perfect fits, and designs that make you feel
confident and comfortable. We aim to deliver a smooth shopping experience withtrusted service and reliable delivery.
</p>

        </div>
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+1-321-582-5614</li>
                <li>forever@companyforyou.com</li>
            </ul>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2026@ forever.com - All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer;