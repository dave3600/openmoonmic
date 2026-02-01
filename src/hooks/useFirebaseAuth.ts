import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { useAuthStore } from '../stores/authStore';
import { getUser } from '../services/firebase/firestore';

export const useFirebaseAuth = () => {
  const { setUser, setUserData, setUserId, setLoading, reset } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Try to get user data from Firestore
        // We'll need to store userId in a way we can retrieve it
        // For now, we'll use a custom claim or store it in the user's displayName
        const userId = firebaseUser.displayName || firebaseUser.uid;
        
        if (userId) {
          const userData = await getUser(userId);
          if (userData) {
            setUserData(userData);
            setUserId(userId);
          }
        }
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserData, setUserId, setLoading, reset]);
};
