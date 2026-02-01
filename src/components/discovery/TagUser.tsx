import { useState } from 'react';
import { tagUser, untagUser } from '../../services/firebase/firestore';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface TagUserProps {
  userId: string;
}

export const TagUser = ({ userId }: TagUserProps) => {
  const { userId: currentUserId } = useAuthStore();
  const { taggedUsers, addTaggedUser, removeTaggedUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  const isTagged = taggedUsers.includes(userId);

  const handleToggle = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      if (isTagged) {
        await untagUser(currentUserId, userId);
        removeTaggedUser(userId);
      } else {
        await tagUser(currentUserId, userId);
        addTaggedUser(userId);
      }
    } catch (error) {
      console.error('Error toggling tag:', error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-full px-3 py-2 rounded text-sm ${
        isTagged
          ? 'bg-yellow-600 hover:bg-yellow-700'
          : 'bg-gray-700 hover:bg-gray-600'
      } disabled:opacity-50 flex items-center justify-center gap-2`}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {isTagged ? '✓ Tagged' : 'Tag User'}
        </>
      )}
    </button>
  );
};
