import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)

  const cartAmount = getCartAmount()
  const totalAmount = cartAmount === 0 ? 0 : cartAmount + delivery_fee

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>
            {currency} {cartAmount.toFixed(2)}
          </p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>
            {currency} {cartAmount === 0 ? '0.00' : delivery_fee.toFixed(2)}
          </p>
        </div>

        <hr />

        <div className='flex justify-between font-medium'>
          <p>Total</p>
          <p>
            {currency} {totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
