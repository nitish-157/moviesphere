import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { FiTrash2, FiUsers, FiStar, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";

import {
  getDashboardStats, getAllUsers, deleteUser, getAllReviews, deleteAnyReview,
} from "../services/adminService.js";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-cine-surface border border-cine-border rounded-lg p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-cine-gold/15 text-cine-gold flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xl font-semibold text-cine-text">{value}</p>
        <p className="text-xs text-cine-muted">{label}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // overview | users | reviews

  const loadAll = async () => {
    try {
      const [statsData, usersData, reviewsData] = await Promise.all([
        getDashboardStats(),
        getAllUsers(),
        getAllReviews(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setReviews(reviewsData);
    } catch {
      toast.error("Couldn't load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user? This can't be undone.")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete user.");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteAnyReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Couldn't delete review.");
    }
  };

  if (loading) {
    return <div className="px-6 py-8 text-cine-muted">Loading dashboard…</div>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-3xl tracking-wide text-cine-text">Admin Dashboard</h1>
      <p className="mt-1.5 text-cine-muted">Welcome back, {currentUser?.name}.</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-cine-border">
        {["overview", "users", "reviews"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? "border-cine-gold text-cine-gold"
                : "border-transparent text-cine-muted hover:text-cine-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers} />
            <StatCard icon={FiStar} label="Total Reviews" value={stats.totalReviews} />
            <StatCard icon={FiShield} label="Admins" value={stats.totalAdmins} />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Signups over time */}
            <div className="bg-cine-surface border border-cine-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-cine-text mb-4">Signups (last 14 days)</h3>
              {stats.signupsOverTime.length === 0 ? (
                <p className="text-sm text-cine-muted">No signups in this period.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={stats.signupsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--cine-border)" />
                    <XAxis dataKey="date" tick={{ fill: "var(--cine-muted)", fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--cine-muted)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "var(--cine-surface2)", border: "1px solid var(--cine-border)" }}
                    />
                    <Line type="monotone" dataKey="count" stroke="var(--cine-gold)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Most reviewed movies */}
            <div className="bg-cine-surface border border-cine-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-cine-text mb-4">Most Reviewed Movies</h3>
              {stats.mostReviewedMovies.length === 0 ? (
                <p className="text-sm text-cine-muted">No reviews yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.mostReviewedMovies}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--cine-border)" />
                    <XAxis dataKey="movieId" tick={{ fill: "var(--cine-muted)", fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--cine-muted)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "var(--cine-surface2)", border: "1px solid var(--cine-border)" }}
                    />
                    <Bar dataKey="reviewCount" fill="var(--cine-gold)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Users */}
      {tab === "users" && (
        <div className="mt-6 bg-cine-surface border border-cine-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cine-border text-left text-cine-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-cine-border last:border-0">
                  <td className="px-4 py-3 text-cine-text">{u.name}</td>
                  <td className="px-4 py-3 text-cine-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        u.role === "admin"
                          ? "bg-cine-gold/15 text-cine-gold"
                          : "bg-cine-surface2 text-cine-muted"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-cine-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u._id !== currentUser.id && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        aria-label="Delete user"
                        className="text-cine-muted hover:text-cine-danger transition-colors"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manage Reviews */}
      {tab === "reviews" && (
        <div className="mt-6 bg-cine-surface border border-cine-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cine-border text-left text-cine-muted">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Movie ID</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-b border-cine-border last:border-0">
                  <td className="px-4 py-3 text-cine-text whitespace-nowrap">{r.user?.name || "—"}</td>
                  <td className="px-4 py-3 text-cine-muted">{r.movieId}</td>
                  <td className="px-4 py-3 text-cine-goldSoft">{r.rating}/10</td>
                  <td className="px-4 py-3 text-cine-muted max-w-xs truncate">{r.text}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      aria-label="Delete review"
                      className="text-cine-muted hover:text-cine-danger transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
