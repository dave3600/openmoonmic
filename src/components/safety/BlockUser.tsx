import { useState } from 'react';
import { blockUser } from '../../services/firebase/firestore';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface BlockUserProps {
  userId: string;
}

export const BlockUser = ({ userId }: BlockUserProps) => {
  const { userId: currentUserId } = useAuthStore();
  const { addBlockedUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const handleBlock = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      await blockUser(currentUserId, userId);
      addBlockedUser(userId);
      setBlocked(true);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
    setLoading(false);
  };

  if (blocked) {
    return (
      <div className="px-3 py-2 bg-red-900/50 rounded text-sm text-red-200 text-center">
        User Blocked
      </div>
    );
  }

  return (
    <button
      onClick={handleBlock}
      disabled={loading}
      className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        'Block User'
      )}
    </button>
  );
};
