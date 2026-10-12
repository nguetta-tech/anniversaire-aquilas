const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w, h, stars = [];
function resizeStars() {
  w = canvas.width = window.innerWidth * devicePixelRatio;
  h = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  stars = Array.from({length: Math.min(150, Math.floor(window.innerWidth / 8))}, () => ({
    x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + .25,
    a: Math.random() * .65 + .15, speed: Math.random() * .008 + .002, phase: Math.random() * 6
  }));
}
function drawStars(t = 0) {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => {
    const alpha = s.a * (.65 + Math.sin(t * s.speed + s.phase) * .35);
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(195, 190, 255, ${alpha})`; ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeStars); resizeStars(); requestAnimationFrame(drawStars);

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function confettiBurst(amount = 150) {
  const colors = ['#a58bff', '#62e8f4', '#f18bff', '#fff0a6', '#ffffff', '#8be8bd'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', (Math.random() * 260 - 130) + 'px');
    piece.style.animationDuration = (2.2 + Math.random() * 3.3) + 's';
    piece.style.animationDelay = (Math.random() * .9) + 's';
    piece.style.width = (5 + Math.random() * 6) + 'px';
    piece.style.height = (8 + Math.random() * 9) + 'px';
    if (Math.random() > .5) piece.style.borderRadius = '50%';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 7000);
  }
}
document.getElementById('revealBtn').addEventListener('click', () => {
  document.getElementById('message').scrollIntoView({behavior:'smooth'});
  confettiBurst(90);
  showToast('✨ Surprise déployée avec succès !');
});
document.getElementById('celebrateBtn').addEventListener('click', () => {
  confettiBurst(240);
  showToast('🎉 JOYEUX ANNIVERSAIRE AQUILAS — MODE LÉGENDE ACTIVÉ !');
  document.querySelector('.final-content').classList.remove('reveal');
  void document.querySelector('.final-content').offsetWidth;
  document.querySelector('.final-content').classList.add('reveal');
});

// Gentle reveal on scroll
const revealItems = document.querySelectorAll('.message-card, .message-copy, .stat-card');
revealItems.forEach(el => el.classList.add('fade-up'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .15});
revealItems.forEach(el => observer.observe(el));

// Optional synth chime, generated locally; no audio files or external API needed.
let audioCtx = null, soundOn = false;
const soundButton = document.getElementById('soundToggle');
const soundLabel = document.getElementById('soundLabel');
function chime() {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(.0001, audioCtx.currentTime + i * .12);
      gain.gain.exponentialRampToValueAtTime(.08, audioCtx.currentTime + i * .12 + .03);
      gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + i * .12 + .45);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * .12); osc.stop(audioCtx.currentTime + i * .12 + .5);
    });
  } catch (e) {}
}
soundButton.addEventListener('click', async () => {
  soundOn = !soundOn;
  soundLabel.textContent = soundOn ? 'SON ON' : 'SON OFF';
  soundButton.style.borderColor = soundOn ? 'rgba(98,232,244,.6)' : '';
  if (soundOn) {
    try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); await audioCtx.resume(); } catch(e) {}
    chime(); showToast('♫ Ambiance sonore activée');
  } else showToast('Son désactivé');
});
document.getElementById('celebrateBtn').addEventListener('click', chime);
