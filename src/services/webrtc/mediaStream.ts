export const getUserMedia = async (
  audio: boolean = true,
  video: boolean = true
): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audio ? {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      } : false,
      video: video ? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      } : false,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};

export const stopMediaStream = (stream: MediaStream): void => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

export const toggleAudio = (stream: MediaStream, enabled: boolean): void => {
  stream.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
};

export const toggleVideo = (stream: MediaStream, enabled: boolean): void => {
  stream.getVideoTracks().forEach((track) => {
    track.enabled = enabled;
  });
};
