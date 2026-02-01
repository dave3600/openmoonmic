import CryptoJS from 'crypto-js';

const ADJECTIVES = [
  'cosmic', 'lunar', 'stellar', 'nebula', 'galactic', 'celestial',
  'aurora', 'comet', 'meteor', 'solar', 'stellar', 'cosmic',
  'mystic', 'ethereal', 'radiant', 'luminous', 'shimmering',
];

const NOUNS = [
  'moon', 'star', 'planet', 'comet', 'nebula', 'galaxy',
  'aurora', 'cosmos', 'orbit', 'eclipse', 'constellation',
  'meteor', 'asteroid', 'satellite', 'photon', 'quasar',
];

export const generateUniqueUserId = (seedHash: string): string => {
  const hash = CryptoJS.SHA256(seedHash + Date.now().toString()).toString();
  const adjIndex = parseInt(hash.substring(0, 2), 16) % ADJECTIVES.length;
  const nounIndex = parseInt(hash.substring(2, 4), 16) % NOUNS.length;
  const num = parseInt(hash.substring(4, 8), 16) % 10000;
  
  return `${ADJECTIVES[adjIndex]}${NOUNS[nounIndex]}${num}`;
};

export const validateUserId = (userId: string): boolean => {
  // Allow alphanumeric, underscores, hyphens, 3-20 chars
  return /^[a-zA-Z0-9_-]{3,20}$/.test(userId);
};
