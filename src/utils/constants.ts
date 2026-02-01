export const APP_NAME = 'OpenMoonMic';
export const APP_SHORT_NAME = 'OMm';

export const GLOBE_CONFIG = {
  minZoom: 0.5,
  maxZoom: 3,
  moonViewThreshold: 0.7,
  tileSize: 64,
  maxVisibleTiles: 100,
};

export const WEBRTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const LATENCY_THRESHOLDS = {
  low: 50, // ms
  medium: 150,
  high: 300,
};

export const GIF_FRAME_UPDATE_INTERVAL = 1000; // ms
