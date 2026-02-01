import { useState } from 'react';
import { useLiveStore } from '../../stores/liveStore';
import { useAuthStore } from '../../stores/authStore';
import { useGlobeStore } from '../../stores/globeStore';
import { linkUserToSession } from '../../services/firebase/realtime';
import { TagUser } from './TagUser';
import { BlockUser } from '../safety/BlockUser';
import { ReportUser } from '../safety/ReportUser';
import { useNavigate } from 'react-router-dom';

interface LinkButtonProps {
  userId: string;
}

export const LinkButton = ({ userId }: LinkButtonProps) => {
  const { linkedUsers, currentSession, setLinkedUsers } = useLiveStore();
  const { userId: currentUserId } = useAuthStore();
  const { setSelectedUserId } = useGlobeStore();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const isLinked = linkedUsers.includes(userId);

  const handleLink = async () => {
    if (!isLinked) {
      if (currentSession) {
        // User is already live, link to their session
        await linkUserToSession(currentSession.sessionId, userId);
        setLinkedUsers([...linkedUsers, userId]);
      } else {
        // User is not live, navigate to live session to start
        navigate('/live');
      }
    }
  };

  const { setSelectedUserId } = useGlobeStore();

  const handleSkip = () => {
    // Skip logic - just close the selection and move to next user
    setSelectedUserId(null);
    // Could implement auto-advance to next user here
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {!isLinked && (
          <button
            onClick={handleLink}
            className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Link
          </button>
        )}
        <button
          onClick={handleSkip}
          className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Skip
        </button>
      </div>

      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-sm"
      >
        {showOptions ? 'Hide Options' : 'More Options'}
      </button>

      {showOptions && (
        <div className="space-y-2 pt-2 border-t border-gray-700">
          <TagUser userId={userId} />
          <BlockUser userId={userId} />
          <ReportUser userId={userId} />
        </div>
      )}
    </div>
  );
};
