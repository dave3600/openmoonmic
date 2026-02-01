import {
  setSignalingData,
  subscribeToSignaling,
  addIceCandidate,
} from '../firebase/realtime';
import { SignalingData } from '../../types';

export const sendOffer = async (
  sessionId: string,
  userId: string,
  offer: RTCSessionDescriptionInit
): Promise<void> => {
  await setSignalingData(sessionId, userId, { offer });
};

export const sendAnswer = async (
  sessionId: string,
  userId: string,
  answer: RTCSessionDescriptionInit
): Promise<void> => {
  await setSignalingData(sessionId, userId, { answer });
};

export const sendIceCandidate = async (
  sessionId: string,
  userId: string,
  candidate: RTCIceCandidateInit
): Promise<void> => {
  await addIceCandidate(sessionId, userId, candidate);
};

export const subscribeToPeerSignaling = (
  sessionId: string,
  peerUserId: string,
  onOffer: (offer: RTCSessionDescriptionInit) => void,
  onAnswer: (answer: RTCSessionDescriptionInit) => void,
  onIceCandidate: (candidate: RTCIceCandidateInit) => void
): (() => void) => {
  return subscribeToSignaling(sessionId, peerUserId, (data) => {
    if (!data) return;

    if (data.offer) {
      onOffer(data.offer);
    }
    if (data.answer) {
      onAnswer(data.answer);
    }
    if (data.iceCandidates && data.iceCandidates.length > 0) {
      data.iceCandidates.forEach((candidate) => {
        onIceCandidate(candidate);
      });
    }
  });
};
