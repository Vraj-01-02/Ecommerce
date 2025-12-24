import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id,image,name,price}) => {
  const {currency} = useContext(ShopContext);

  // Defensive: handle missing or malformed image prop
  const imageUrl = Array.isArray(image) && image.length > 0 ? image[0] : '';

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        {imageUrl ? (
          <img className='hover:scale-110 transition ease-in-out' src={imageUrl} alt={name || ''} />
        ) : (
          <div className='w-full h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500'>No Image</div>
        )}
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem