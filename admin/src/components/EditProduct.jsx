import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";

const EditProduct = ({ product, onClose, refresh }) => {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    category: product.category,
    subCategory: product.subCategory,
  });

  const [newImages, setNewImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("subCategory", form.subCategory);

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.put(
        `${backendUrl}/api/product/update/${product._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        refresh();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-120 bg-white rounded-2xl shadow-2xl border border-gray-100">

        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage product information and media assets
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>

            <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/40 hover:bg-indigo-50 cursor-pointer transition">
              <FiUploadCloud className="text-2xl text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                Click to upload new images
              </span>
              <span className="text-xs text-gray-500">
                Old images will be permanently replaced
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setNewImages([...e.target.files])}
              />
            </label>
          </div>

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          {/* SUB CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type (Sub Category)
            </label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Winterwear</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
