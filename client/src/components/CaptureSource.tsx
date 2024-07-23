export default class CaptureSource {
  constructor() {
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('muted', '');
    this.mediaStream = null;
    this.videoSourceType = null;
  }

  async setVideoSource(videoSourceType, sourceId = null) {
    this.stopCapture();
    this.videoSourceType = videoSourceType;
    this.sourceId = sourceId;
    await this.startCapture();
  }

  async startCapture() {
    try {
      let stream;
      switch (this.videoSourceType) {
        case 'camera':
          const videoConstraints = this.sourceId ? { video: { deviceId: { exact: this.sourceId } } } : { video: true };           
          stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
          break;
        case 'desktop':
          stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          break;
        case 'window':
          // Using https://github.com/webrtc/samples/tree/gh-pages/src/content/capture/window-picker
          // for window capturing functionality
          break;
        default:
          throw new Error('Invalid video source type');
      }
      this.mediaStream = stream;
      this.video.srcObject = stream;
      await this.video.play();
    } catch (error) {
      console.error('Error accessing video source:', error.message);
    }
  }

  stopCapture() {
    if (this.mediaStream) {
      this.mediaStream.getVideoTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  getVideoElement() {
    return this.video;
  }

  async getAvailableVideoSources() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoSources = devices.filter(device => device.kind === 'videoinput');
    return [
      { type: 'camera', name: 'Camera' },
      { type: 'desktop', name: 'Desktop' },
      // Add window capturing option (see the linked repository for implementation)
      // { type: 'window', name: 'Window' },
      ...videoSources.map(device => ({ type: 'camera', name: device.label, deviceId: device.deviceId }))
    ];
  }
}

