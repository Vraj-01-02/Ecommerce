import api from "../utils/api";
import React, { useState, useEffect } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import EditProduct from "../components/EditProduct";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const List = () => {
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  const fetchList = async () => {
    try {
      const response = await api.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ================= TOGGLE ACTIVE / INACTIVE ================= */
  const toggleStatus = async (id) => {
    try {
      const response = await api.patch(
        `${backendUrl}/api/product/toggle/${id}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ================= HARD DELETE (HIDDEN / OPTIONAL) ================= */
  const removeProduct = async (id) => {
    try {
      const response = await api.delete(
        `${backendUrl}/api/product/${id}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product permanently?")) {
      removeProduct(id);
    }
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">All Products</h2>
        <span className="text-[13px] font-medium text-gray-500">
          Total Products: {list.length}
        </span>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* TABLE HEADER */}
        <div
          className="hidden md:grid grid-cols-[90px_3fr_1.5fr_1fr_1fr_160px]
                     border-b border-gray-200
                     text-gray-700 text-[12px] font-bold uppercase tracking-wider
                     px-6 py-4"
        >
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-center">Action</span>
        </div>

        {/* TABLE BODY */}
        <div className="divide-y">
          {list.map((item) => (
            <div
              key={item._id}
              className="
                flex flex-col md:grid
                md:grid-cols-[90px_3fr_1.5fr_1fr_1fr_160px]
                md:items-center
                px-4 md:px-6 py-5 gap-4 md:gap-6
                hover:bg-gray-50 transition
              "
            >
              {/* IMAGE + NAME */}
              <div className="flex items-start gap-4 md:contents">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg border"
                />

                <div>
                  <p className="text-[15px] md:text-[16px] font-semibold text-gray-900">
                    {item.name}
                  </p>

                  <div className="flex items-center gap-3 md:hidden mt-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-100 text-indigo-700">
                      {item.category}
                    </span>
                    <span className="text-[14px] font-bold">
                      {currency}{item.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="hidden md:block">
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-indigo-100 text-indigo-700">
                  {item.category}
                </span>
              </div>

              {/* PRICE */}
              <p className="hidden md:block text-[16px] font-bold">
                {currency}{item.price}
              </p>

              {/* STATUS BADGE */}
              <div>
                {item.isActive ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                    Inactive
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 justify-end md:justify-center">
                {/* TOGGLE */}
                <button
                  onClick={() => toggleStatus(item._id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold ${
                    item.isActive
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {item.isActive ? "Deactivate" : "Activate"}
                </button>

                {/* EDIT */}
                <button
                  onClick={() => {
                    setSelectedProduct(item);
                    setShowEdit(true);
                  }}
                  className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                >
                  <FiEdit size={16} />
                </button>

                {/* HARD DELETE (OPTIONAL / SUPER ADMIN) */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <MdDeleteOutline size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          onClose={() => setShowEdit(false)}
          refresh={fetchList}
        />
      )}
    </>
  );
};

export default List;
