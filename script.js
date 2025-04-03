let audioContext;
let audioSource;
let audioElement;
let analyser;
let frequencyData;
let amplitudeData;
let particles = [];
let smoothedAmplitude = 0;
let smoothedBass = 0;
let smoothedMid = 0;
let smoothedTreble = 0;
let visualStyle = 'geometric';
let sensitivity = 1;
let currentPalette = 'default';

// Add these variables at the top with your other declarations
let capturer;
let isRecording = false;
let recordingStartTime;
let recordingDuration;

// Color palettes
const palettes = {
  default: [[30, 64, 118], [16, 185, 129], [212, 175, 55]],
  earthy: [[87, 65, 47], [139, 119, 101], [184, 134, 11]],
  cool: [[34, 83, 120], [70, 130, 180], [135, 206, 235]]
};

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas');
  background(15, 23, 42);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(212, 175, 55);
  text("Upload an audio file to begin", width / 2, height / 2);

  // Event listeners for controls
  document.getElementById('styleSelect').addEventListener('change', (e) => {
    visualStyle = e.target.value;
  });
  document.getElementById('colorSelect').addEventListener('change', (e) => {
    currentPalette = e.target.value;
  });
  document.getElementById('sensitivity').addEventListener('input', (e) => {
    sensitivity = parseFloat(e.target.value);
  });
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      currentPalette = swatch.dataset.palette;
      document.getElementById('colorSelect').value = currentPalette;
    });
  });

  // Add these event listeners in your setup() function
  document.getElementById('start-recording').addEventListener('click', startRecording);
  document.getElementById('stop-recording').addEventListener('click', stopRecording);

  // Verify CCapture is loaded
  if (typeof CCapture === 'undefined') {
    console.error('CCapture library not loaded. Recording will not work.');
    document.getElementById('start-recording').disabled = true;
    document.getElementById('recording-status').textContent = 
        'Recording unavailable - Library not loaded';
  }
}

function draw() {
  background(15, 23, 42, 80);

  if (analyser) {
    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(amplitudeData);

    let amplitude = 0;
    for (let i = 0; i < amplitudeData.length; i++) {
      amplitude += abs(amplitudeData[i] - 128);
    }
    amplitude /= amplitudeData.length;
    amplitude = map(amplitude, 0, 128, 0, 300) * sensitivity;

    let bass = average(frequencyData.slice(0, 50)) * sensitivity;
    let mid = average(frequencyData.slice(50, 100)) * sensitivity;
    let treble = average(frequencyData.slice(100, 256)) * sensitivity;

    smoothedAmplitude = lerp(smoothedAmplitude, amplitude, 0.15);
    smoothedBass = lerp(smoothedBass, bass, 0.15);
    smoothedMid = lerp(smoothedMid, mid, 0.15);
    smoothedTreble = lerp(smoothedTreble, treble, 0.15);

    let colors = palettes[currentPalette];

    // Enhanced Visuals
    if (visualStyle === 'geometric' || visualStyle === 'light') {
      push();
      translate(width / 2, height / 2);
      rotate(frameCount * 0.01 * (smoothedMid / 255));
      let polySize = map(smoothedAmplitude, 0, 255, 50, 250);
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = `rgba(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]}, 0.7)`;
      drawPolygon(0, 0, polySize, 8, colors[0]); // 8 sides for more elegance
      drawPolygon(0, 0, polySize * 0.6, 8, colors[2]); // Inner layer
      drawingContext.shadowBlur = 0;
      pop();
    }

    if (visualStyle === 'light' || visualStyle === 'geometric') {
      if (random() < smoothedBass / 300 && particles.length < 60) {
        particles.push(new Particle(random(width), random(height), smoothedTreble));
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].isDone()) particles.splice(i, 1);
      }
    }

    if (visualStyle === 'calligraphy' || visualStyle === 'geometric') {
      stroke(colors[1]);
      strokeWeight(map(smoothedMid, 0, 255, 1, 5));
      noFill();
      for (let j = 0; j < 3; j++) { // Multiple lines
        beginShape();
        for (let i = 0; i < 10; i++) {
          let x = width * noise(i * 0.2 + j * 10, frameCount * 0.015 + j);
          let y = height * noise(i * 0.2 + j * 10 + 100, frameCount * 0.015 + j);
          curveVertex(x, y);
        }
        endShape();
      }
      // Add inspirational flourish
      stroke(colors[2]);
      strokeWeight(1);
      for (let i = 0; i < smoothedTreble / 50; i++) {
        let x = width * noise(i * 0.3, frameCount * 0.02);
        let y = height * noise(i * 0.3 + 200, frameCount * 0.02);
        point(x, y);
      }
    }
  }

  if (isRecording) {
    capturer.capture(canvas);
  }
}

function drawPolygon(x, y, radius, sides, col) {
  noStroke();
  fill(col[0], col[1], col[2], 220);
  beginShape();
  for (let i = 0; i < sides; i++) {
    let angle = TWO_PI / sides * i;
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}

class Particle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.vx = random(-1.5, 1.5) * (speed / 255);
    this.vy = random(-1.5, 1.5) * (speed / 255);
    this.size = random(3, 8);
    this.life = random(50, 120);
    this.color = palettes[currentPalette][floor(random(palettes[currentPalette].length))];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.8;
  }
  show() {
    noStroke();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.5)`;
    fill(this.color[0], this.color[1], this.color[2], this.life);
    ellipse(this.x, this.y, this.size);
    drawingContext.shadowBlur = 0;
  }
  isDone() {
    return this.life <= 0;
  }
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

document.getElementById('audioInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    if (audioElement) {
      audioElement.parentNode.removeChild(audioElement); // Replace remove() with this
    }
    audioElement = new Audio(URL.createObjectURL(file));
    audioElement.controls = true;
    document.body.appendChild(audioElement);

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      amplitudeData = new Uint8Array(analyser.frequencyBinCount);
    }

    audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    audioElement.play();
    console.log("Audio loaded and playing!");
  }
});

// Add this function after setup()
function initializeRecorder() {
  try {
      if (typeof CCapture === 'undefined') {
          throw new Error('CCapture library not loaded');
      }

      const aspectRatio = document.getElementById('aspect-ratio').value;
      const dimensions = aspectRatio === 'landscape' ? 
          { width: 1920, height: 1080 } : 
          { width: 1080, height: 1920 };

      capturer = new CCapture({
          format: 'webm',
          framerate: 30,
          verbose: true,
          display: true,
          quality: 100,
          name: `islamic-visualization-${aspectRatio}`
      });

      // Resize canvas for recording
      resizeCanvas(dimensions.width, dimensions.height);
      recordingDuration = audioElement ? audioElement.duration * 1000 : 10000;
      
      console.log('Recorder initialized successfully');
      return true;
  } catch (error) {
      console.error('Error initializing recorder:', error);
      document.getElementById('recording-status').textContent = 
          'Error: Recording initialization failed. Check console for details.';
      return false;
  }
}

// Add these functions for recording control
function startRecording() {
    if (!audioElement) {
        alert('Please upload an audio file first!');
        return;
    }

    const startBtn = document.getElementById('start-recording');
    const stopBtn = document.getElementById('stop-recording');
    startBtn.disabled = true;
    stopBtn.disabled = false;
    document.getElementById('recording-status').textContent = 'Initializing...';
    
    try {
        if (!initializeRecorder()) {
            throw new Error('Failed to initialize recorder');
        }
        
        recordingStartTime = Date.now();
        audioElement.currentTime = 0;
        
        // Start recording
        capturer.start();
        isRecording = true;
        audioElement.play();
        
        document.getElementById('recording-status').textContent = 'Recording...';
    } catch (error) {
        console.error('Recording failed:', error);
        startBtn.disabled = false;
        stopBtn.disabled = true;
        document.getElementById('recording-status').textContent = 
            'Error: Recording failed. Please refresh and try again.';
    }
}

function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    const audioElement = document.querySelector('audio');
    if (audioElement) {
        audioElement.pause();
    }
    
    capturer.stop();
    capturer.save(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `islamic-visualization-${document.getElementById('aspect-ratio').value}.webm`;
        link.click();
        URL.revokeObjectURL(url);
    });
    
    // Reset canvas size and button states
    resizeCanvas(800, 600);
    
    const startBtn = document.getElementById('start-recording');
    const stopBtn = document.getElementById('stop-recording');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    document.getElementById('recording-status').textContent = 'Recording complete! File downloaded.';
}