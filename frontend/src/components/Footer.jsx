import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full">
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Brand Info */}
        <div>
          <img
            src={assets.logo}
            className='mb-5 w-32'
            alt="Forever Indian clothing brand logo"
          />
          <p className='w-full md:w-2/3 text-gray-600 leading-relaxed'>
            We offer a curated range of stylish and comfortable clothing inspired
            by modern Indian fashion trends. From daily wear to festive outfits,
            our focus is on quality fabric, perfect fitting, and reliable delivery
            across India.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li><Link to="/" className="hover:text-black">Home</Link></li>
            <li><Link to="/about" className="hover:text-black">About Us</Link></li>
            <li><Link to="/shipping" className="hover:text-black">Shipping & Delivery</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>
              <a href="tel:+919876543210" className="hover:text-black">
                +91 98765 43210
              </a>
            </li>
            <li>
              <a href="mailto:support@forever.in" className="hover:text-black">
                support@forever.in
              </a>
            </li>
            <li className="text-gray-500 text-xs mt-1">
              Customer Support: Mon–Sat (10 AM – 7 PM)
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <p className='py-5 text-sm text-center text-gray-500'>
        © {currentYear} forever.in — All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
