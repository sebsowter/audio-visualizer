class AudioVisualizer {

  constructor(url) {
    this.animationFrame = null;

    this.audio = new Audio(url);

    this.canvas = document.createElement('canvas');
    this.canvas.width = 200 * 4;
    this.canvas.height = 256;

    this.canvasContext = this.canvas.getContext("2d");
    
    document.body.appendChild(this.canvas);
  }
  
  init() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(this.audio);
    source.connect(this.analyser);
    source.connect(audioContext.destination);
  }

  play() {
    if (!this.analyser) {
      this.init();
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
    const gradient = this.canvasContext.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(1, "yellow");
    
    this.analyser.getByteFrequencyData(dataArray);
    
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < dataArray.length; i++) {
      
      this.canvasContext.fillStyle = gradient;
      this.canvasContext.fillRect(i * 4, 256 - dataArray[i], 3, dataArray[i]);
    }
  }
} 
