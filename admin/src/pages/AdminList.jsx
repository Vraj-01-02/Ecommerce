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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-b text-sm hover:bg-gray-50"
                >
                  <td className="py-2">{admin.name}</td>
                  <td className="py-2">{admin.email}</td>
                  <td className="py-2 font-medium">{admin.role}</td>
                  <td className="py-2 text-right">
                    {admin.role !== "SuperAdmin" && (
                      <button
                        onClick={() => handleDelete(admin._id)}
                        disabled={deletingId === admin._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Delete Admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminList;
