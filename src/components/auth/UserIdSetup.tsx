import { useState } from 'react';
import { updateUserId } from '../../services/firebase/auth';
import { useAuthStore } from '../../stores/authStore';
import { validateUserId } from '../../utils/userId';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const UserIdSetup = () => {
  const { userId, setUserId } = useAuthStore();
  const [newUserId, setNewUserId] = useState(userId || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!userId) {
      setError('No current user ID');
      return;
    }

    if (!validateUserId(newUserId)) {
      setError('Invalid user ID. Use 3-20 alphanumeric characters, underscores, or hyphens.');
      return;
    }

    if (newUserId === userId) {
      setError('New user ID must be different from current one');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateUserId(userId, newUserId);
    
    if (result.success) {
      setUserId(newUserId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to update user ID');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Change User ID</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Current User ID
        </label>
        <input
          type="text"
          value={userId || ''}
          disabled
          className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          New User ID
        </label>
        <input
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="Enter new user ID"
          className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          3-20 characters, alphanumeric, underscores, or hyphens
        </p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-600 rounded p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-600 rounded p-3 text-sm text-green-200">
          User ID updated successfully!
        </div>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading || !newUserId || newUserId === userId}
        className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Updating...</span>
          </>
        ) : (
          <span>Update User ID</span>
        )}
      </button>
    </div>
  );
};
