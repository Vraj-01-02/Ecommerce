import axios from 'axios'
import React from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import EditProduct from "../components/EditProduct";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";



const List = () => {
  const [list, setList] = useState([])
  const [showEdit, setShowEdit] = useState(false)
const [selectedProduct, setSelectedProduct] = useState(null)

  
  const fetchList = async()=>{
    try{
     const response = await axios.get(
  `${backendUrl}/api/product/list`
);

      if(response.data.success){
        setList(response.data.products)
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error){
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchList()
  }, [])

  console.log("Fetched Products:", list) 

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');  // ✅ Fetch token
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
  
     const response = await axios.post(
  `${backendUrl}/api/product/remove`,
  { id },
  { headers: { token } }
);


  
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    removeProduct(id);
  }
};

  

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/*List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.images?.[0] || 'default-image-url'} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
<div className="flex gap-3 justify-end md:justify-center">
  {/* EDIT */}
  <button
    onClick={() => {
      setSelectedProduct(item);
      setShowEdit(true);
    }}
    className="
      p-2 rounded-full 
      bg-blue-50 text-blue-600 
      hover:bg-blue-100 hover:scale-110 
      transition-all duration-200
    "
    title="Edit Product"
  >
    <FiEdit size={18} />
  </button>

  {/* DELETE */}
  <button
    onClick={() => handleDelete(item._id)}
    className="
      p-2 rounded-full 
      bg-red-50 text-red-600 
      hover:bg-red-100 hover:scale-110 
      transition-all duration-200
    "
    title="Delete Product"
  >
    <MdDeleteOutline size={20} />
  </button>
</div>
</div>

          ))
        }
      </div>
      {showEdit && selectedProduct && (
  <EditProduct
    product={selectedProduct}
    onClose={() => setShowEdit(false)}
    refresh={fetchList}
  />
)}

    </>
  )
}

export default List;