import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { User, UserPreferences } from '../../types';

const USERS_COLLECTION = 'users';
const REPORTS_COLLECTION = 'reports';

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (!userDoc.exists()) return null;
  return { ...userDoc.data(), createdAt: userDoc.data().createdAt?.toDate() } as User;
};

export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    preferences: preferences,
  });
};

export const blockUser = async (
  userId: string,
  blockedUserId: string
): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    blockedUsers: arrayUnion(blockedUserId),
  });
};

export const unblockUser = async (
  userId: string,
  blockedUserId: string
): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    blockedUsers: arrayRemove(blockedUserId),
  });
};

export const tagUser = async (
  userId: string,
  taggedUserId: string
): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    taggedUsers: arrayUnion(taggedUserId),
  });
};

export const untagUser = async (
  userId: string,
  taggedUserId: string
): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    taggedUsers: arrayRemove(taggedUserId),
  });
};

export const reportUser = async (
  reporterId: string,
  reportedUserId: string,
  reason: string,
  details?: string
): Promise<void> => {
  await setDoc(doc(db, REPORTS_COLLECTION), {
    reporterId,
    reportedUserId,
    reason,
    details,
    timestamp: serverTimestamp(),
    status: 'pending',
  });
};

export const subscribeToUser = (
  userId: string,
  callback: (user: User | null) => void
): (() => void) => {
  return onSnapshot(
    doc(db, USERS_COLLECTION, userId),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as User);
      } else {
        callback(null);
      }
    }
  );
};
