class AudioVisualizer {

  constructor(url) {
    this.url = url;
    this.firstPlay = true;
    this.animationFrame = null;

    this.audio = document.createElement('audio');
    this.audio.src = this.url;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 200 * 4;
    this.canvas.height = 256;
    this.canvasContext = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  }
  
  connect() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    
    this.source.connect(this.analyser);
    this.source.connect(this.audioContext.destination);
    
    this.dataArray = new Uint8Array(200);
    this.firstPlay = false;
  }

  play() {
    if (this.firstPlay) {
      this.connect();
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
    this.analyser.getByteFrequencyData(this.dataArray);
    
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.dataArray.length; i++) {
      this.canvasContext.fillStyle = "#999999";
      this.canvasContext.fillRect(i * 4, 256 - this.dataArray[i], 3, this.dataArray[i]);
    }
  }
} 
