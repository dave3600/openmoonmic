import { useEffect, useRef, useCallback } from 'react';
import { setupPeerConnection, closePeerConnection } from '../services/webrtc/peerConnection';
import { sendOffer, sendAnswer, sendIceCandidate, subscribeToPeerSignaling } from '../services/webrtc/signaling';
import { useLiveStore } from '../stores/liveStore';
import { PeerConnection } from '../types';

interface UseWebRTCOptions {
  sessionId: string;
  userId: string;
  localStream?: MediaStream;
  peerUserIds: string[];
  onRemoteStream?: (peerId: string, stream: MediaStream) => void;
}

export const useWebRTC = ({
  sessionId,
  userId,
  localStream,
  peerUserIds,
  onRemoteStream,
}: UseWebRTCOptions) => {
  const { addPeerConnection, removePeerConnection, peerConnections } = useLiveStore();
  const connectionsRef = useRef<Map<string, PeerConnection>>(new Map());

  const createConnection = useCallback(
    async (peerUserId: string, isInitiator: boolean) => {
      if (connectionsRef.current.has(peerUserId)) {
        return; // Connection already exists
      }

      const peerConn = setupPeerConnection(
        peerUserId,
        localStream,
        (remoteStream) => {
          if (onRemoteStream) {
            onRemoteStream(peerUserId, remoteStream);
          }
        },
        async (candidate) => {
          await sendIceCandidate(sessionId, peerUserId, candidate.toJSON());
        },
        (state) => {
          if (state === 'closed' || state === 'failed' || state === 'disconnected') {
            connectionsRef.current.delete(peerUserId);
            removePeerConnection(peerUserId);
          }
        }
      );

      connectionsRef.current.set(peerUserId, peerConn);
      addPeerConnection(peerUserId, peerConn);

      // Set up signaling subscription
      const unsubscribe = subscribeToPeerSignaling(
        sessionId,
        peerUserId,
        async (offer) => {
          if (!isInitiator) {
            await peerConn.connection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConn.connection.createAnswer();
            await peerConn.connection.setLocalDescription(answer);
            await sendAnswer(sessionId, peerUserId, answer);
          }
        },
        async (answer) => {
          if (isInitiator) {
            await peerConn.connection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        },
        async (candidate) => {
          try {
            await peerConn.connection.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
      );

      // If initiator, create and send offer
      if (isInitiator) {
        const offer = await peerConn.connection.createOffer();
        await peerConn.connection.setLocalDescription(offer);
        await sendOffer(sessionId, peerUserId, offer);
      }

      return () => {
        unsubscribe();
        if (connectionsRef.current.has(peerUserId)) {
          const conn = connectionsRef.current.get(peerUserId);
          if (conn) {
            closePeerConnection(conn);
          }
          connectionsRef.current.delete(peerUserId);
          removePeerConnection(peerUserId);
        }
      };
    },
    [sessionId, userId, localStream, onRemoteStream, addPeerConnection, removePeerConnection]
  );

  useEffect(() => {
    // Create connections for all peer users
    peerUserIds.forEach((peerUserId) => {
      if (peerUserId !== userId && !connectionsRef.current.has(peerUserId)) {
        const isInitiator = userId < peerUserId; // Simple way to determine initiator
        createConnection(peerUserId, isInitiator);
      }
    });

    // Cleanup
    return () => {
      connectionsRef.current.forEach((conn, peerUserId) => {
        if (!peerUserIds.includes(peerUserId)) {
          closePeerConnection(conn);
          connectionsRef.current.delete(peerUserId);
          removePeerConnection(peerUserId);
        }
      });
    };
  }, [peerUserIds, userId, createConnection, removePeerConnection]);

  return {
    connections: connectionsRef.current,
  };
};
