import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE PERMISSIONS ================= */
  const handlePermissionChange = (permission) => {
    setForm((prev) => {
      const alreadySelected = prev.permissions.includes(permission);

      return {
        ...prev,
        permissions: alreadySelected
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { name, email, password, permissions } = form;

    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/admin/create", {
        name,
        email,
        password,
        permissions, // 🔥 IMPORTANT
      });

      if (data.success) {
        toast.success("Admin created successfully");
        setForm({
          name: "",
          email: "",
          password: "",
          permissions: [],
        });
      } else {
        toast.error(data.message || "Failed to create admin");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "You are not authorized"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Admin name"
            className="w-full border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@email.com"
            className="w-full border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Temporary password"
            className="w-full border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* ================= PERMISSIONS ================= */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Admin Permissions
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.permissions.includes("products")}
                onChange={() => handlePermissionChange("products")}
              />
              <span>Products (Add / Edit / Delete)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.permissions.includes("orders")}
                onChange={() => handlePermissionChange("orders")}
              />
              <span>Orders (View / Update Status)</span>
            </label>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
