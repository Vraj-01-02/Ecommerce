import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import userApi from '../utils/userApi'
import { toast } from 'react-toastify'
import {
  User,
  Mail,
  ShoppingBag,
  Clock, 
  Camera,
  Lock,
  Calendar
} from 'lucide-react'

const Profile = () => {
  const { token } = useContext(ShopContext)
  const navigate = useNavigate()
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '' })
  
  // Password Reset State
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' })
  
  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await userApi.post('/api/user/profile')
      if (response.data.success) {
        setUserData(response.data.user)
        setEditForm({
          name: response.data.user.name || ''
        })
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const response = await userApi.post('/api/user/update-profile', editForm)
      if (response.data.success) {
        setUserData(response.data.user)
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    }
  }

  // Change Password
  const handleChangePassword = async () => {
    try {
        if (!passwordForm.current || !passwordForm.new) {
            toast.error("Please fill in all fields")
            return
        }
        if (passwordForm.new.length < 8) {
            toast.error("New password must be at least 8 characters")
            return
        }

        const response = await userApi.post('/api/user/change-password', passwordForm)
        
        if (response.data.success) {
            toast.success("Password updated successfully")
            setShowPasswordModal(false)
            setPasswordForm({ current: '', new: '' })
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        console.error(error)
        toast.error("Failed to update password")
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      fetchUserProfile()
    }
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please login to view your profile</p>
      </div>
    )
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4f46e5&color=fff&size=128`
  const joinDate = userData.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 min-h-[80vh]">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        My Profile
      </h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl border p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-sm">
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt={userData.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border shadow"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-semibold">{userData.name}</h2>
          <p className="text-gray-500 text-sm sm:text-base break-all">
            {userData.email}
          </p>
          <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
            Customer
          </span>
        </div>
      </div>

       {/* ================= IDENTITY ================= */}
       <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b font-semibold text-gray-700">
          User Identity
        </div>

        {isEditing ? (
          <div className="p-5 space-y-4">
            <div>
                <label className="text-sm text-gray-600 mb-1 block">Name</label>
                <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                    setIsEditing(false)
                    setEditForm({
                        name: userData.name
                    })
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <Row icon={<User size={18} />} label="Name" value={userData.name} />
            <Row icon={<Mail size={18} />} label="Email" value={userData.email} />

            <Row icon={<Calendar size={18} />} label="Member Since" value={joinDate} />
            
            <div className="p-4 bg-gray-50">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 font-medium hover:text-indigo-800 transition"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

      {/* ================= SECURITY ================= */}
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b font-semibold text-gray-700">
          Security
        </div>
        <Row
          icon={<Lock size={18} />}
          label="Password"
          value={
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Change Password
            </button>
          }
        />
      </div>

        {/* ================= PASSWORD MODAL ================= */}
        {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
            <div>
                <input
                type="password"
                placeholder="Current Password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.current}
                onChange={(e) =>
                    setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                />
            </div>
            <div>
                <input
                type="password"
                placeholder="New Password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.new}
                onChange={(e) =>
                    setPasswordForm({ ...passwordForm, new: e.target.value })
                }
                />
            </div>
            <div className="flex gap-3 justify-end pt-2">
                <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                Update
                </button>
                <button
                onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordForm({ current: '', new: '' })
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  )
}

const Row = ({ icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4 border-b last:border-0 hover:bg-gray-50 transition">
    <div className="flex items-center gap-3 w-full sm:w-40 text-gray-600">
      {icon} {label}
    </div>
    <div className="font-medium text-gray-800 break-all">{value}</div>
  </div>
)

export default Profile
