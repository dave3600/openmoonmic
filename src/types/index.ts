export interface User {
  userId: string;
  seedPhraseHash: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  createdAt: Date;
  preferences: UserPreferences;
  blockedUsers: string[];
  taggedUsers: string[];
}

export interface UserPreferences {
  audioOnly: boolean;
  autoLink: boolean;
  discoveryRadius: number;
}

export interface LiveSession {
  sessionId: string;
  hostId: string;
  linkedUsers: string[];
  status: 'live' | 'ended';
  audioUrl?: string;
  audioVolume: number;
  createdAt: Date;
}

export interface SignalingData {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidates: RTCIceCandidateInit[];
}

export interface LiveUser {
  userId: string;
  sessionId: string;
  lat: number;
  lng: number;
  status: 'live' | 'linking' | 'idle';
  latency?: number;
  audioOnly?: boolean;
}

export interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  latency?: number;
}
