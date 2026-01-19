import { useEffect, useState } from "react";
import api from "../utils/api";
import {
  User,
  Mail,
  Shield,
  Camera,
  Lock,
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "" });
  const [imageUploading, setImageUploading] = useState(false);

  /* ================= FETCH PROFILE ================= */

  const fetchAdminProfile = async () => {
    try {
      const { data } = await api.get("/api/admin/profile");
      if (data.success) {
        setAdmin(data.admin);
        setEditForm({ name: data.admin.name });
      }
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/api/admin/dashboard-stats");
      if (data.success) setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchStats();
  }, []);

  /* ================= UPDATE PROFILE ================= */

  const handleUpdateProfile = async () => {
    try {
      const { data } = await api.put("/api/admin/profile", {
        name: editForm.name,
      });

      if (data.success) {
        toast.success("Profile updated");
        setAdmin(data.admin);
        setIsEditing(false);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = async () => {
    try {
      const { data } = await api.put(
        "/api/admin/change-password",
        passwordForm
      );

      if (data.success) {
        toast.success("Password updated");
        setShowPasswordModal(false);
        setPasswordForm({ current: "", new: "" });
      }
    } catch {
      toast.error("Password change failed");
    }
  };

  /* ================= UPLOAD AVATAR ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setImageUploading(true);
    try {
      const { data } = await api.put("/api/admin/upload-avatar", formData);

      if (data.success) {
        toast.success("Profile photo updated");
        setAdmin(data.admin);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  if (!admin) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Admin Profile
      </h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl border p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative shrink-0">
          <img
            src={
              admin.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border shadow"
          />
          <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer">
            <Camera size={16} />
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-semibold">
            {admin.name}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base break-all">
            {admin.email}
          </p>
          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {admin.role}
          </span>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Package} label="Products" value={stats.totalProducts} />
        <StatCard icon={ShoppingCart} label="Orders" value={stats.totalOrders} />
        <StatCard icon={Users} label="Users" value={stats.totalUsers} />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={`₹${stats.totalRevenue}`}
        />
      </div>

      {/* ================= IDENTITY ================= */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-4 sm:p-5 border-b font-semibold text-gray-700">
          Admin Identity
        </div>

        {isEditing ? (
          <div className="p-5 space-y-4">
            <input
              value={editForm.name}
              onChange={(e) => setEditForm({ name: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <Row icon={<User size={18} />} label="Name" value={admin.name} />
            <Row icon={<Mail size={18} />} label="Email" value={admin.email} />
            <Row icon={<Shield size={18} />} label="Role" value={admin.role} />
            <div className="p-4 bg-gray-50">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 font-medium"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

      {/* ================= SECURITY ================= */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-4 sm:p-5 border-b font-semibold text-gray-700">
          Security
        </div>
        <Row
          icon={<Lock size={18} />}
          label="Password"
          value={
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Change Password
            </button>
          }
        />
      </div>

      {/* ================= PASSWORD MODAL ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Update
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Row = ({ icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4 border-b last:border-0">
    <div className="flex items-center gap-3 w-full sm:w-40 text-gray-600">
      {icon} {label}
    </div>
    <div className="font-medium text-gray-800 break-all">
      {value}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-indigo-100 rounded-xl">
      <Icon className="text-indigo-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminProfile;
