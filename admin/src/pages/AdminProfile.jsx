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

/* ================= AUTH HEADER HELPER ================= */

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const AdminProfile = ({ token }) => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
  });
  const [imageUploading, setImageUploading] = useState(false);

  /* ================= FETCH PROFILE ================= */

  const fetchAdminProfile = async () => {
    try {
      const { data } = await api.get(
        `/api/admin/profile`,
        authHeader(token)
      );

      if (data.success) {
        setAdmin(data.admin);
        setEditForm({ name: data.admin.name });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    }
  };

  /* ================= FETCH STATS ================= */

  const fetchStats = async () => {
    try {
      const { data } = await api.get(
        `/api/admin/dashboard-stats`,
        authHeader(token)
      );
      setStats(data);
    } catch {
      console.log("Stats not available");
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminProfile();
      fetchStats();
    }
  }, [token]);

  /* ================= UPDATE PROFILE ================= */

  const handleUpdateProfile = async () => {
    try {
      const { data } = await api.put(
        `/api/admin/update-profile`,
        { name: editForm.name },
        authHeader(token)
      );

      if (data.success) {
        toast.success("Profile updated");
        setAdmin(data.admin);
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = async () => {
    try {
      const { data } = await api.put(
        `/api/admin/change-password`,
        passwordForm,
        authHeader(token)
      );

      if (data.success) {
        toast.success("Password updated");
        setShowPasswordModal(false);
        setPasswordForm({ current: "", new: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
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
      const { data } = await api.put(
        `/api/admin/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile photo updated");
        setAdmin(data.admin);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  if (!admin) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-xl flex gap-6 border">
        <div className="relative">
          <img
            src={
              admin.avatar
                ? `${backendUrl}${admin.avatar}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-24 h-24 rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
            <Camera size={16} />
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-semibold">{admin.name}</h2>
          <p className="text-gray-500">{admin.email}</p>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {admin.role}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Products" value={stats.totalProducts} />
        <StatCard icon={ShoppingCart} label="Orders" value={stats.totalOrders} />
        <StatCard icon={Users} label="Users" value={stats.totalUsers} />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={`₹${stats.totalRevenue}`}
        />
      </div>

      {/* IDENTITY */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b font-semibold">Admin Identity</div>

        {isEditing ? (
          <div className="p-4 space-y-4">
            <input
              value={editForm.name}
              onChange={(e) => setEditForm({ name: e.target.value })}
              className="input"
            />
            <div className="flex gap-3">
              <button onClick={handleUpdateProfile} className="btn-primary">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
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
                className="text-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

      {/* SECURITY */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b font-semibold">Security</div>
        <Row
          icon={<Lock size={18} />}
          label="Password"
          value={
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-primary"
            >
              Change Password
            </button>
          }
        />
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="input"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="input"
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
            />
            <div className="flex gap-3">
              <button onClick={handleChangePassword} className="btn-primary">
                Update
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-secondary"
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
  <div className="flex items-center px-6 py-4 border-b last:border-0">
    <div className="flex items-center gap-3 w-40 text-gray-600">
      {icon} {label}
    </div>
    <div className="font-medium">{value}</div>
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
    <div className="p-3 bg-blue-100 rounded-lg">
      <Icon className="text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

export default AdminProfile;
