import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { seedPhraseToHash, normalizeSeedPhrase } from '../../utils/seedPhrase';
import { generateUniqueUserId, validateUserId } from '../../utils/userId';
import { User } from '../../types';
import CryptoJS from 'crypto-js';

const USERS_COLLECTION = 'users';

export interface SeedPhraseAuthResult {
  success: boolean;
  user?: FirebaseUser;
  userId?: string;
  error?: string;
}

export const signUpWithSeedPhrase = async (
  seedPhrase: string,
  userId?: string
): Promise<SeedPhraseAuthResult> => {
  try {
    const normalized = normalizeSeedPhrase(seedPhrase);
    const seedHash = seedPhraseToHash(normalized);
    
    // Generate unique user ID if not provided
    let finalUserId = userId;
    if (!finalUserId) {
      finalUserId = generateUniqueUserId(seedHash);
    } else if (!validateUserId(finalUserId)) {
      return { success: false, error: 'Invalid user ID format' };
    }

    // Check if userId is already taken
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, finalUserId));
    if (userDoc.exists()) {
      return { success: false, error: 'User ID already taken' };
    }

    // Create email/password account using seed hash as password
    // We'll use a deterministic email based on userId
    const email = `${finalUserId}@openmoonmic.local`;
    const password = seedHash.substring(0, 20); // Use first 20 chars as password

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document in Firestore
    const userData: Omit<User, 'createdAt'> & { createdAt: any } = {
      userId: finalUserId,
      seedPhraseHash: CryptoJS.AES.encrypt(seedHash, seedHash).toString(),
      preferences: {
        audioOnly: false,
        autoLink: false,
        discoveryRadius: 1000,
      },
      blockedUsers: [],
      taggedUsers: [],
      createdAt: new Date(),
    };

    await setDoc(doc(db, USERS_COLLECTION, finalUserId), userData);

    return {
      success: true,
      user: userCredential.user,
      userId: finalUserId,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signInWithSeedPhrase = async (
  seedPhrase: string
): Promise<SeedPhraseAuthResult> => {
  try {
    const normalized = normalizeSeedPhrase(seedPhrase);
    const seedHash = seedPhraseToHash(normalized);

    // We need to find the user by seed phrase hash
    // This is a limitation - we'll need to store a mapping or use a different approach
    // For now, we'll use the seed hash to derive a potential userId and check
    const potentialUserId = generateUniqueUserId(seedHash);
    
    // Try to get user document
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, potentialUserId));
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userDoc.data() as User;
    
    // Verify seed phrase by decrypting and comparing
    const decryptedHash = CryptoJS.AES.decrypt(
      userData.seedPhraseHash,
      seedHash
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedHash !== seedHash) {
      return { success: false, error: 'Invalid seed phrase' };
    }

    // Sign in with email/password
    const email = `${userData.userId}@openmoonmic.local`;
    const password = seedHash.substring(0, 20);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user,
      userId: userData.userId,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const updateUserBackup = async (
  userId: string,
  email?: string,
  phone?: string
): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const updates: any = {};
  
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  
  await setDoc(userRef, updates, { merge: true });
};

export const updateUserId = async (
  oldUserId: string,
  newUserId: string
): Promise<{ success: boolean; error?: string }> => {
  if (!validateUserId(newUserId)) {
    return { success: false, error: 'Invalid user ID format' };
  }

  try {
    // Check if new userId is available
    const newUserDoc = await getDoc(doc(db, USERS_COLLECTION, newUserId));
    if (newUserDoc.exists()) {
      return { success: false, error: 'User ID already taken' };
    }

    // Get old user data
    const oldUserDoc = await getDoc(doc(db, USERS_COLLECTION, oldUserId));
    if (!oldUserDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    // Create new document with new userId
    await setDoc(doc(db, USERS_COLLECTION, newUserId), {
      ...oldUserDoc.data(),
      userId: newUserId,
    });

    // Delete old document
    // Note: In production, you might want to keep both and mark old as inactive

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
