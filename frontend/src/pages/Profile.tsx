import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Notification from '../components/Notification';

interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
  role: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const navigate = useNavigate();
  const { logout, userId } = useAuth();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data: UserProfile = await response.json();
      setUser(data);
      setFormData(data);
    } catch (err: any) {
      setError(err.message);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      setNotification({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      fetchProfile(); // Refetch to show updated data
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading profile...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  if (!user) return <div className="text-center text-gray-500 mt-4">No user data found. Please log in.</div>;

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Profile</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
          <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" type="email" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
          <input name="first_name" value={formData.first_name || ''} onChange={handleChange} placeholder="First Name" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
          <input name="last_name" value={formData.last_name || ''} onChange={handleChange} placeholder="Last Name" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
          <input name="address" value={formData.address || ''} onChange={handleChange} placeholder="Address" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
          <input name="phone_number" value={formData.phone_number || ''} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg" />
          <div className="flex gap-4">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p><span className="font-semibold">Username:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">First Name:</span> {user.first_name || 'N/A'}</p>
          <p><span className="font-semibold">Last Name:</span> {user.last_name || 'N/A'}</p>
          <p><span className="font-semibold">Address:</span> {user.address || 'N/A'}</p>
          <p><span className="font-semibold">Phone Number:</span> {user.phone_number || 'N/A'}</p>
          <button onClick={() => setIsEditing(true)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
