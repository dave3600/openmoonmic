import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { signOutUser } from '../../services/firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Navigation = () => {
  const { user, userId } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/discover"
            className={`px-3 py-2 rounded ${
              location.pathname === '/discover'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Discover
          </Link>
          <Link
            to="/live"
            className={`px-3 py-2 rounded ${
              location.pathname === '/live'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Go Live
          </Link>
          <Link
            to="/preferences"
            className={`px-3 py-2 rounded ${
              location.pathname === '/preferences'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Preferences
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{userId}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
