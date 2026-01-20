import { useEffect, useState } from "react";
import api from "../utils/api";
import { ShieldCheck, User, Clock } from "lucide-react";
import { toast } from "react-toastify";

const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get("/api/admin/activity");

      if (data.success) {
        setActivities(data.activities);
      }
    } catch (err) {
      toast.error("Failed to load admin activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading activity...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <ShieldCheck className="text-indigo-600" />
        Admin Activity Logs
      </h1>

      {activities.length === 0 ? (
        <p className="text-gray-500">No activity found.</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          {activities.map((a) => (
            <div
              key={a._id}
              className="flex flex-col sm:flex-row justify-between gap-4 p-4 border-b last:border-0"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium text-gray-800">
                  {a.description}
                </p>

                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {a.adminName}
                  </span>

                  <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                    {a.role}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock size={14} />
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminActivity;
