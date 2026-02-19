import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Phone, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white pt-20 pb-8 border-t border-gray-100">
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm'>

        {/* Brand Info */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              alt="FABRIC logo"
              className="w-12 h-12 object-contain"
            />
            {/* TEXT : DESKTOP & MOBILE */}
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-wide text-gray-900 group-hover:text-indigo-600 transition-colors">
                FABRIC
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                Official Store
              </span>
            </div>
          </div>

          <p className='w-full md:w-2/3 text-gray-600 leading-relaxed text-base'>
            We offer a curated range of stylish and comfortable clothing inspired
            by modern Indian fashion trends. Elevate your wardrobe with our premium collection.
          </p>


        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-semibold mb-6 text-gray-900 relative inline-block'>
            COMPANY
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-indigo-600 rounded-full"></span>
          </p>
          <ul className='flex flex-col gap-3 text-gray-600 font-medium'>
            {['Home', 'About Us', 'Shipping & Delivery', 'Privacy Policy'].map((item) => (
               <li key={item}>
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className='text-xl font-semibold mb-6 text-gray-900 relative inline-block'>
            GET IN TOUCH
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-indigo-600 rounded-full"></span>
          </p>
          <ul className='flex flex-col gap-4 text-gray-600'>
            <li className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Phone size={16} />
              </div>
              <a href="tel:+919876543210" className="group-hover:text-indigo-600 transition-colors font-medium">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Mail size={16} />
              </div>
              <a href="mailto:support@fabric.in" className="group-hover:text-indigo-600 transition-colors font-medium">
                support@fabric.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-10 pt-6">
        <p className='text-sm text-center text-gray-500 font-medium'>
          © {currentYear} <span className="text-indigo-600 font-bold">FABRIC</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
