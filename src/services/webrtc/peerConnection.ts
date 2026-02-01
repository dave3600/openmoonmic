import { WEBRTC_CONFIG } from '../../utils/constants';
import { PeerConnection } from '../../types';

export const createPeerConnection = (): RTCPeerConnection => {
  return new RTCPeerConnection(WEBRTC_CONFIG);
};

export const setupPeerConnection = (
  peerId: string,
  localStream?: MediaStream,
  onRemoteStream?: (stream: MediaStream) => void,
  onIceCandidate?: (candidate: RTCIceCandidate) => void,
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void
): PeerConnection => {
  const connection = createPeerConnection();

  // Add local stream tracks
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      connection.addTrack(track, localStream);
    });
  }

  // Handle remote stream
  connection.ontrack = (event) => {
    if (onRemoteStream && event.streams[0]) {
      onRemoteStream(event.streams[0]);
    }
  };

  // Handle ICE candidates
  connection.onicecandidate = (event) => {
    if (event.candidate && onIceCandidate) {
      onIceCandidate(event.candidate);
    }
  };

  // Handle connection state changes
  connection.onconnectionstatechange = () => {
    if (onConnectionStateChange) {
      onConnectionStateChange(connection.connectionState);
    }
  };

  // Monitor latency (RTT)
  let latency: number | undefined;
  const startTime = Date.now();
  
  connection.oniceconnectionstatechange = () => {
    if (connection.iceConnectionState === 'connected') {
      // Estimate latency based on connection establishment time
      latency = Date.now() - startTime;
    }
  };

  return {
    peerId,
    connection,
    localStream,
    latency,
  };
};

export const closePeerConnection = (peerConnection: PeerConnection): void => {
  if (peerConnection.localStream) {
    peerConnection.localStream.getTracks().forEach((track) => track.stop());
  }
  peerConnection.connection.close();
};
