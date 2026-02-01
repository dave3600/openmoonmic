import { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { updateUserPreferences } from '../../services/firebase/firestore';
import { LoadingSpinner } from './LoadingSpinner';

export const Preferences = () => {
  const { userId } = useAuthStore();
  const { preferences, setPreferences } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (updates: Partial<typeof preferences>) => {
    if (!userId) return;

    setLoading(true);
    try {
      await updateUserPreferences(userId, updates);
      setPreferences(updates);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold">Preferences</h3>

      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span>Audio Only Mode</span>
          <input
            type="checkbox"
            checked={preferences.audioOnly}
            onChange={(e) => handleUpdate({ audioOnly: e.target.checked })}
            className="w-4 h-4"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span>Auto Link Mode</span>
          <input
            type="checkbox"
            checked={preferences.autoLink}
            onChange={(e) => handleUpdate({ autoLink: e.target.checked })}
            className="w-4 h-4"
          />
        </label>

        <div>
          <label className="block text-sm font-medium mb-2">
            Discovery Radius: {preferences.discoveryRadius} km
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={preferences.discoveryRadius}
            onChange={(e) => handleUpdate({ discoveryRadius: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      {success && (
        <div className="bg-green-900/50 border border-green-600 rounded p-3 text-sm text-green-200">
          Preferences saved!
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
};
