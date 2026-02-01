import { useState } from 'react';
import { updateUserBackup } from '../../services/firebase/auth';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const BackupOptions = () => {
  const { userId } = useAuthStore();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    if (!email && !phone) {
      setError('Please provide at least one backup option');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserBackup(userId, email || undefined, phone || undefined);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update backup options');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Backup Options</h3>
      <p className="text-sm text-gray-400">
        Add email or phone number as backup for account recovery
      </p>

      <div>
        <label className="block text-sm font-medium mb-2">
          Email (optional)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1234567890"
          className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-600 rounded p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-600 rounded p-3 text-sm text-green-200">
          Backup options updated successfully!
        </div>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading || (!email && !phone)}
        className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Save Backup Options</span>
        )}
      </button>
    </div>
  );
};
