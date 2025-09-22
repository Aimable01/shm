// Physics constants and variables
let A = 1; // Amplitude
let Xm = 2; // Maximum displacement
let omega = 2 * Math.PI; // Angular frequency
let phi = 0; // Phase
let time = 0;
let animationId;
let isAnimating = false;

// Canvas elements
const springCanvas = document.getElementById("springCanvas");
const graphCanvas = document.getElementById("graphCanvas");
const springCtx = springCanvas.getContext("2d");
const graphCtx = graphCanvas.getContext("2d");

// Input elements
const amplitudeInput = document.getElementById("amplitude");
const xmInput = document.getElementById("xm");
const omegaInput = document.getElementById("omega");

// Add event listeners
amplitudeInput.addEventListener("input", updateVisualization);
xmInput.addEventListener("input", updateVisualization);
omegaInput.addEventListener("input", updateVisualization);

function updateVisualization() {
  A = parseFloat(amplitudeInput.value);
  Xm = parseFloat(xmInput.value);
  omega = parseFloat(omegaInput.value);

  if (isAnimating) {
    cancelAnimationFrame(animationId);
  }

  drawSpring();
  drawGraph();
}

function drawSpring() {
  const canvas = springCanvas;
  const ctx = springCtx;
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Calculate current displacement
  const x = Xm * Math.sin(omega * time + phi);
  const displacement = (x / Xm) * 100; // Scale to canvas

  // Draw fixed support
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(width - 50, 50);
  ctx.stroke();

  // Draw spring
  const springX = width / 2;
  const springTopY = 50;
  const springBottomY = 150 + displacement;

  ctx.strokeStyle = "#666";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(springX, springTopY);

  // Draw spring coils
  const springLength = springBottomY - springTopY;
  const coilCount = Math.max(8, Math.floor(springLength / 15));
  const coilHeight = springLength / coilCount;

  for (let i = 0; i < coilCount; i++) {
    const y = springTopY + i * coilHeight;
    const coilWidth = 20;
    ctx.lineTo(springX - coilWidth, y + coilHeight / 2);
    ctx.lineTo(springX + coilWidth, y + coilHeight);
  }
  ctx.lineTo(springX, springBottomY);
  ctx.stroke();

  // Draw mass
  ctx.fillStyle = "#ff6b6b";
  ctx.beginPath();
  ctx.arc(springX, springBottomY, 25, 0, 2 * Math.PI);
  ctx.fill();

  // Draw mass outline
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw arrows indicating motion
  if (Math.abs(displacement) > 5) {
    ctx.strokeStyle = "#4ecdc4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (displacement > 0) {
      // Down arrow
      ctx.moveTo(springX + 40, springBottomY);
      ctx.lineTo(springX + 40, springBottomY + 20);
      ctx.moveTo(springX + 35, springBottomY + 15);
      ctx.lineTo(springX + 40, springBottomY + 20);
      ctx.lineTo(springX + 45, springBottomY + 15);
    } else {
      // Up arrow
      ctx.moveTo(springX + 40, springBottomY);
      ctx.lineTo(springX + 40, springBottomY - 20);
      ctx.moveTo(springX + 35, springBottomY - 15);
      ctx.lineTo(springX + 40, springBottomY - 20);
      ctx.lineTo(springX + 45, springBottomY - 15);
    }
    ctx.stroke();
  }

  // Draw equilibrium line
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(width - 50, 150);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawGraph() {
  const canvas = graphCanvas;
  const ctx = graphCtx;
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, height / 2);
  ctx.lineTo(width - 50, height / 2);
  ctx.moveTo(50, 30);
  ctx.lineTo(50, height - 30);
  ctx.stroke();

  // Draw axis labels
  ctx.fillStyle = "#333";
  ctx.font = "14px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillText("Time", width / 2, height - 10);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Value", 0, 0);
  ctx.restore();

  // Draw grid lines
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    const x = 50 + (i * (width - 100)) / 10;
    ctx.beginPath();
    ctx.moveTo(x, 30);
    ctx.lineTo(x, height - 30);
    ctx.stroke();
  }

  // Calculate and draw curves
  const timeRange = (4 * Math.PI) / omega;
  const timeStep = timeRange / 200;

  // Displacement (x) - Red
  ctx.strokeStyle = "#ff6b6b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let t = 0; t <= timeRange; t += timeStep) {
    const x = Xm * Math.sin(omega * t + phi);
    const graphX = 50 + (t / timeRange) * (width - 100);
    const graphY = height / 2 - (x / Xm) * 100;
    if (t === 0) {
      ctx.moveTo(graphX, graphY);
    } else {
      ctx.lineTo(graphX, graphY);
    }
  }
  ctx.stroke();

  // Velocity (v) - Teal
  ctx.strokeStyle = "#4ecdc4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let t = 0; t <= timeRange; t += timeStep) {
    const v = Xm * omega * Math.cos(omega * t + phi);
    const graphX = 50 + (t / timeRange) * (width - 100);
    const graphY = height / 2 - (v / (Xm * omega)) * 100;
    if (t === 0) {
      ctx.moveTo(graphX, graphY);
    } else {
      ctx.lineTo(graphX, graphY);
    }
  }
  ctx.stroke();

  // Acceleration (a) - Blue
  ctx.strokeStyle = "#45b7d1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let t = 0; t <= timeRange; t += timeStep) {
    const a = -Xm * omega * omega * Math.sin(omega * t + phi);
    const graphX = 50 + (t / timeRange) * (width - 100);
    const graphY = height / 2 - (a / (Xm * omega * omega)) * 100;
    if (t === 0) {
      ctx.moveTo(graphX, graphY);
    } else {
      ctx.lineTo(graphX, graphY);
    }
  }
  ctx.stroke();

  // Draw current time indicator
  const currentTime = time % timeRange;
  const indicatorX = 50 + (currentTime / timeRange) * (width - 100);
  ctx.strokeStyle = "#ff6b6b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(indicatorX, 30);
  ctx.lineTo(indicatorX, height - 30);
  ctx.stroke();
}

function animate() {
  time += 0.05;
  drawSpring();
  drawGraph();
  animationId = requestAnimationFrame(animate);
}

function updateVisualization() {
  A = parseFloat(amplitudeInput.value);
  Xm = parseFloat(xmInput.value);
  omega = parseFloat(omegaInput.value);

  if (isAnimating) {
    cancelAnimationFrame(animationId);
  }

  drawSpring();
  drawGraph();
}

// Play button functionality
document.querySelector(".play-button").addEventListener("click", function () {
  if (isAnimating) {
    cancelAnimationFrame(animationId);
    isAnimating = false;
    this.textContent = "🎮 Play Animation!";
  } else {
    isAnimating = true;
    this.textContent = "⏸️ Pause Animation!";
    animate();
  }
});

// Initialize the visualization
updateVisualization();
