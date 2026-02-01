import { useEffect, useRef } from 'react';
import { useLiveStore } from '../stores/liveStore';
import { useGlobeStore } from '../stores/globeStore';
import { GIF_FRAME_UPDATE_INTERVAL } from '../utils/constants';

export const useLatencyMonitor = () => {
  const { peerConnections } = useLiveStore();
  const { updateLiveUser } = useGlobeStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Monitor latency for each peer connection
    const monitorLatency = () => {
      peerConnections.forEach((peerConn, peerId) => {
        if (peerConn.connection) {
          const stats = peerConn.connection.getStats();
          
          stats.then((results) => {
            results.forEach((report) => {
              if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                const rtt = report.currentRoundTripTime;
                if (rtt) {
                  const latency = Math.round(rtt * 1000); // Convert to ms
                  updateLiveUser(peerId, { latency });
                }
              }
            });
          }).catch((error) => {
            console.error('Error getting stats:', error);
          });
        }
      });
    };

    intervalRef.current = setInterval(monitorLatency, GIF_FRAME_UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [peerConnections, updateLiveUser]);
};
