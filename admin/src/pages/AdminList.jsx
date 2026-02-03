import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { Trash2 } from "lucide-react";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/list");

      if (data.success) {
        setAdmins(data.admins);
      } else {
        toast.error(data.message || "Failed to load admins");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "You are not authorized"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      setDeletingId(id);
      const { data } = await api.delete(`/api/admin/${id}`);

      if (data.success) {
        toast.success("Admin deleted successfully");
        setAdmins((prev) => prev.filter((a) => a._id !== id));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete not allowed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Admins</h2>
        <span className="text-sm text-gray-500">
          Total: {admins.length}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading admins...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500">No admins found.</p>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* HEADER (Desktop Only) */}
          <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_0.5fr] items-center bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 border-b">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div className="text-center">Action</div>
          </div>

          {/* ROWS */}
          <div className="flex flex-col divide-y divide-gray-200">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr_0.5fr] items-center px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                {/* Name */}
                <div className="font-medium text-gray-900 md:font-normal">
                  {admin.name}
                </div>

                {/* Email */}
                <div className="text-gray-600 break-all md:break-normal">
                  {admin.email}
                </div>

                {/* Role */}
                <div className="mt-1 md:mt-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                      admin.role === "SuperAdmin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {admin.role === "SuperAdmin"
                      ? "Super Admin"
                      : admin.permissions?.includes("products")
                      ? "Product Admin"
                      : admin.permissions?.includes("orders")
                      ? "Order Admin"
                      : "Admin"}
                  </span>
                </div>

                {/* Action */}
                 <div className="flex justify-end md:justify-center w-full md:w-auto mt-2 md:mt-0">
                  {admin.role !== "SuperAdmin" && (
                    <button
                      onClick={() => handleDelete(admin._id)}
                      disabled={deletingId === admin._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Delete Admin"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
