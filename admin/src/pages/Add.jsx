import React, { useState } from "react";
import api from "../utils/api";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";

const Add = () => {
  /* ================= STATES ================= */
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");

  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  /* ================= SIZE TOGGLE ================= */
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  /* ================= SUBMIT (AXIOS FIX) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description) {
      toast.error("Please fill all required fields");
      return;
    }

    if (images.every((img) => img === null)) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Append images with correct field names
      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      const res = await api.post("/api/product/add", formData);

      if (res.data.success) {
        toast.success("Product added successfully");

        // reset
        setName("");
        setPrice("");
        setDescription("");
        setCategory("Men");
        setSubCategory("Topwear");
        setSizes([]);
        setBestseller(false);
        setImages([null, null, null, null]);
      } else {
        toast.error(res.data.message || "Product add failed");
      }
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err.response?.data || err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 px-3 md:px-8 py-5 bg-[#f6f7fb]">
      {/* TITLE */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Add New Product
        </h2>
        <div className="h-1 w-32 bg-indigo-600 rounded mt-2" />
      </div>

      {/* FORM WRAPPER */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl"
      >
        {/* ================= IMAGES ================= */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Product Images
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-28 border border-gray-300 rounded-lg
                           flex items-center justify-center bg-white"
              >
                <input
                  id={`image-${i}`}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleImageChange(i, e.target.files[0])
                  }
                />

                <label
                  htmlFor={`image-${i}`}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  {img ? (
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-500 mb-1" />
                      <span className="text-xs text-gray-500">
                        Upload
                      </span>
                    </>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          {/* NAME + PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className="w-full rounded-lg border-gray-300 bg-gray-50 p-2"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full rounded-lg border-gray-300 bg-gray-50 p-2"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full rounded-lg border-gray-300 bg-gray-50 p-2 mb-5"
          />

          {/* CATEGORY */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border-gray-300 bg-gray-50 p-2"
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>

            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="rounded-lg border-gray-300 bg-gray-50 p-2"
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
            </select>
          </div>

          {/* SIZES */}
          <div className="mb-5">
            <p className="text-sm font-semibold mb-2">
              Product Sizes
            </p>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-1.5 rounded-md border ${
                    sizes.includes(size)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* BESTSELLER */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={() => setBestseller(!bestseller)}
            />
            <span className="text-sm">Mark as Bestseller</span>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-md text-sm font-semibold text-white
                       bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
