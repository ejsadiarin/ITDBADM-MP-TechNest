import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
  const navigate = useNavigate();
  const { syncAuth } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile');

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data: UserProfile = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
        // If profile fetch fails, it means the session is invalid
        // Clear any lingering local storage items (though they shouldn't be used now)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // // Clear local storage items (though they shouldn't be used now)
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      syncAuth(); // Update auth state
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading profile...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  if (!user) return <div className="text-center text-gray-500 mt-4">No user data found. Please log in.</div>;

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Profile</h2>
      <div className="space-y-4">
        <p className="text-lg"><span className="font-semibold">Username:</span> {user.username}</p>
        <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="text-lg"><span className="font-semibold">Role:</span> {user.role}</p>
        {user.first_name && <p className="text-lg"><span className="font-semibold">First Name:</span> {user.first_name}</p>}
        {user.last_name && <p className="text-lg"><span className="font-semibold">Last Name:</span> {user.last_name}</p>}
        {user.address && <p className="text-lg"><span className="font-semibold">Address:</span> {user.address}</p>}
        {user.phone_number && <p className="text-lg"><span className="font-semibold">Phone Number:</span> {user.phone_number}</p>}
      </div>
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
