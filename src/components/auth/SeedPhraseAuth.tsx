import { useState } from 'react';
import { generateSeedPhrase, validateSeedPhrase } from '../../utils/seedPhrase';
import { signUpWithSeedPhrase, signInWithSeedPhrase } from '../../services/firebase/auth';
import { useAuthStore } from '../../stores/authStore';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const SeedPhraseAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [generatedPhrase, setGeneratedPhrase] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setUserId: setStoreUserId } = useAuthStore();

  const handleGenerate = () => {
    const phrase = generateSeedPhrase();
    setGeneratedPhrase(phrase);
    setSeedPhrase(phrase);
  };

  const handleSignUp = async () => {
    if (!seedPhrase) {
      setError('Please generate or enter a seed phrase');
      return;
    }

    if (!validateSeedPhrase(seedPhrase)) {
      setError('Invalid seed phrase');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await signUpWithSeedPhrase(seedPhrase, userId || undefined);
    
    if (result.success && result.user && result.userId) {
      setUser(result.user);
      setStoreUserId(result.userId);
    } else {
      setError(result.error || 'Sign up failed');
    }
    
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!seedPhrase) {
      setError('Please enter your seed phrase');
      return;
    }

    if (!validateSeedPhrase(seedPhrase)) {
      setError('Invalid seed phrase');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await signInWithSeedPhrase(seedPhrase);
    
    if (result.success && result.user && result.userId) {
      setUser(result.user);
      setStoreUserId(result.userId);
    } else {
      setError(result.error || 'Sign in failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">OpenMoonMic</h1>
          <p className="text-gray-400">OMm</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded ${
                isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded ${
                !isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Sign In
            </button>
          </div>

          {isSignUp && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  User ID (optional)
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Leave empty for auto-generated"
                  className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {!generatedPhrase && (
                <button
                  onClick={handleGenerate}
                  className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Generate Seed Phrase
                </button>
              )}

              {generatedPhrase && (
                <div className="bg-gray-800 p-4 rounded border border-yellow-600">
                  <p className="text-sm text-yellow-400 mb-2">
                    ⚠️ Save this seed phrase securely. You'll need it to sign in.
                  </p>
                  <p className="text-sm font-mono break-words">
                    {generatedPhrase}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {isSignUp ? 'Confirm Seed Phrase' : 'Seed Phrase'}
            </label>
            <textarea
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              placeholder="Enter your 12-word seed phrase"
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={isSignUp ? handleSignUp : handleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
