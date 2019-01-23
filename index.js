class AudioVisualizer {

  constructor(url) {
    this.animationFrame = null;

    this.audio = document.createElement('audio');
    this.audio.src = url;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 200 * 4;
    this.canvas.height = 256;
    this.canvasContext = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  }
  
  connectContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();

    const source = this.audioContext.createMediaElementSource(this.audio);
    source.connect(this.analyser);
    source.connect(this.audioContext.destination);
  }

  play() {
    if (!this.audioContext) {
      this.connectContext();
    }

    this.audio.play();

    this.animate();
  }

  pause() {
    this.audio.pause();
    
    cancelAnimationFrame(this.animationFrame);
  }

  animate() {
    this.animationFrame = requestAnimationFrame(() => this.animate());

    this.onFrame();
  }

  onFrame() {
    const dataArray = new Uint8Array(200);
    
    this.analyser.getByteFrequencyData(dataArray);
    
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < dataArray.length; i++) {
      this.canvasContext.fillStyle = "#999999";
      this.canvasContext.fillRect(i * 4, 256 - dataArray[i], 3, dataArray[i]);
    }
  }
} 
