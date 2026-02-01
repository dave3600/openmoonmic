import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';

export const generateSeedPhrase = (): string => {
  return bip39.generateMnemonic(128); // 12 words
};

export const validateSeedPhrase = (phrase: string): boolean => {
  return bip39.validateMnemonic(phrase);
};

export const seedPhraseToHash = (phrase: string): string => {
  return CryptoJS.SHA256(phrase).toString();
};

export const normalizeSeedPhrase = (phrase: string): string => {
  return phrase.trim().toLowerCase().replace(/\s+/g, ' ');
};
