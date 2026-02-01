import { useState } from 'react';
import { reportUser } from '../../services/firebase/firestore';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface ReportUserProps {
  userId: string;
}

const REPORT_REASONS = [
  'Inappropriate content',
  'Harassment',
  'Spam',
  'Other',
];

export const ReportUser = ({ userId }: ReportUserProps) => {
  const { userId: currentUserId } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    if (!currentUserId || !reason) return;

    setLoading(true);
    try {
      await reportUser(currentUserId, userId, reason, details || undefined);
      setReported(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error reporting user:', error);
    }
    setLoading(false);
  };

  if (reported) {
    return (
      <div className="px-3 py-2 bg-yellow-900/50 rounded text-sm text-yellow-200 text-center">
        User Reported
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full px-3 py-2 bg-orange-600 rounded hover:bg-orange-700 text-sm"
      >
        Report User
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-sm"
      >
        <option value="">Select reason...</option>
        {REPORT_REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Additional details (optional)"
        rows={2}
        className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-sm resize-none"
      />

      <div className="flex gap-2">
        <button
          onClick={handleReport}
          disabled={loading || !reason}
          className="flex-1 px-3 py-2 bg-orange-600 rounded hover:bg-orange-700 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Submit Report'
          )}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
