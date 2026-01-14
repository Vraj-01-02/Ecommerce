import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
  const { products } = useContext(ShopContext)

  const latestProducts = useMemo(() => {
    const upperWear = products.filter(
      item =>
        item.subCategory === 'Topwear' ||
        item.subCategory === 'Winterwear'
    )

    const bottomWear = products
      .filter(item => item.subCategory === 'Bottomwear')
      .slice(0, 3) // 👈 sirf 3 bottom wear

    return [...upperWear, ...bottomWear].slice(0, 10)
  }, [products])

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore our latest upper wear styles with a few handpicked bottom wear
          options to complete your look.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map(item => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.images?.[0] || ""}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
