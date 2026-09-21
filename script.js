/* ==========================================================================
   ROMANTIC INTERACTIVE ENGINE - FOR YOU ❤️
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  initMobileMenu();
  initTrustSlider();
  initNoButtonPhysics();
  initYesCelebration();
  initParticleCanvas();
});

/* ==========================================================================
   1. MOBILE NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   2. TRUST SLIDER ENGINE
   ========================================================================== */
function initTrustSlider() {
  const slider = document.getElementById('trust-slider');
  const progress = document.getElementById('slider-progress');
  const badgeValue = document.getElementById('trust-value');
  const messageText = document.getElementById('trust-message');

  if (!slider || !progress || !badgeValue || !messageText) return;

  const messages = [
    { max: 20, text: "Okay… I have some work to do. 😅 But I'm willing to earn every bit of it." },
    { max: 49, text: "I'll be patient. Trust takes time. ❤️ Every step counts." },
    { max: 69, text: "That's a good start... I'll keep proving myself." },
    { max: 89, text: "That's a good start... I'm working hard to make it 100%." },
    { max: 99, text: "We're almost there… ❤️ You mean the world to me." },
    { max: 100, text: "100%! ❤️ You won't regret trusting me." }
  ];

  function updateSlider(val) {
    const value = parseInt(val, 10);
    progress.style.width = `${value}%`;
    badgeValue.textContent = value;

    // Find corresponding text
    const matched = messages.find(m => value <= m.max);
    if (matched) {
      messageText.textContent = matched.text;
    }
  }

  slider.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Submit trust rating to Formspree when user releases/changes slider
  slider.addEventListener('change', (e) => {
    sendToFormspree({
      event: 'Trust Rating Update',
      trust_rating: `${e.target.value}%`,
      timestamp: new Date().toLocaleString()
    });
  });

  // Initial call
  updateSlider(slider.value);
}

/* ==========================================================================
   FORMSPREE INTEGRATION
   ========================================================================== */
async function sendToFormspree(data) {
  try {
    await fetch('https://formspree.io/f/maenejqw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.warn('Formspree submission error:', err);
  }
}

/* ==========================================================================
   3. PLAYFUL EVASIVE NO BUTTON PHYSICS
   ========================================================================== */
function initNoButtonPhysics() {
  const noBtn = document.getElementById('btn-no');
  const noWrapper = document.getElementById('no-btn-wrapper');
  const teaserToast = document.getElementById('teaser-toast');
  const teaserText = document.getElementById('teaser-text');
  const actionBox = document.getElementById('question-actions-box');

  if (!noBtn || !noWrapper || !teaserToast || !teaserText) return;

  let attemptCount = 0;

  const teasers = [
    "Are you sure? 😏",
    "Think again... 💭",
    "Nice try 😂",
    "That button is running away... 🏃‍♂️",
    "Maybe YES? ❤️",
    "Fine, only YES is left! ❤️"
  ];

  function evadeNoButton(e) {
    if (e) e.preventDefault();
    attemptCount++;

    if (attemptCount >= teasers.length - 1) {
      // Final attempt: dissolve button completely!
      teaserText.textContent = teasers[teasers.length - 1];
      teaserToast.classList.add('show');
      noBtn.style.transform = 'scale(0) rotate(180deg)';
      noBtn.style.opacity = '0';
      setTimeout(() => {
        noWrapper.style.display = 'none';
      }, 300);
      
      // Spawn burst of small heart particles around where NO button was
      createHeartBurstAt(noWrapper.getBoundingClientRect());
      return;
    }

    // Show current teaser toast
    teaserText.textContent = teasers[attemptCount - 1];
    teaserToast.classList.add('show');

    // Calculate bounded evasive translation
    const boxRect = actionBox ? actionBox.getBoundingClientRect() : { width: 300, height: 100 };
    const btnRect = noBtn.getBoundingClientRect();

    const maxDeltaX = Math.min((boxRect.width / 2) - 60, 150);
    const maxDeltaY = 60;

    // Generate random offset direction
    let randomX = (Math.random() - 0.5) * 2 * maxDeltaX;
    let randomY = (Math.random() - 0.5) * 2 * maxDeltaY;

    // Ensure it moves a decent distance
    if (Math.abs(randomX) < 40) randomX = randomX < 0 ? -60 : 60;
    if (Math.abs(randomY) < 20) randomY = randomY < 0 ? -30 : 30;

    noWrapper.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  // Bind Desktop & Mobile Events
  noBtn.addEventListener('mouseenter', evadeNoButton);
  noBtn.addEventListener('touchstart', evadeNoButton, { passive: false });
  noBtn.addEventListener('click', evadeNoButton);
}

/* Helper to create heart burst on button dissolve */
function createHeartBurstAt(rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  if (window.spawnCelebrationBurst) {
    window.spawnCelebrationBurst(centerX, centerY, 20);
  }
}

/* ==========================================================================
   4. YES CELEBRATION STAGE
   ========================================================================== */
function initYesCelebration() {
  const yesBtn = document.getElementById('btn-yes');
  const questionHeader = document.getElementById('question-header');
  const questionActions = document.getElementById('question-actions-box');
  const teaserToast = document.getElementById('teaser-toast');
  const hintText = document.getElementById('no-hint-text');
  const celebrationStage = document.getElementById('celebration-stage');

  if (!yesBtn || !celebrationStage) return;

  yesBtn.addEventListener('click', () => {
    // Send Formspree Notification
    const trustVal = document.getElementById('trust-slider')?.value || '70';
    sendToFormspree({
      event: 'SHE SAID YES! ❤️',
      answer: 'YES! She accepted to be your girlfriend! ❤️',
      trust_rating: `${trustVal}%`,
      timestamp: new Date().toLocaleString()
    });

    // Hide initial question items smoothly
    if (questionHeader) questionHeader.style.display = 'none';
    if (questionActions) questionActions.style.display = 'none';
    if (teaserToast) teaserToast.style.display = 'none';
    if (hintText) hintText.style.display = 'none';

    // Reveal Celebration Stage
    celebrationStage.classList.remove('hidden');

    // Scroll smoothly to celebration stage
    celebrationStage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Trigger Mass Canvas Particle Explosion
    if (window.spawnCelebrationBurst) {
      window.spawnCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2, 90);
    }
  });
}

/* ==========================================================================
   5. CANVAS PARTICLE SYSTEM (HEARTS & PETALS)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxAmbientParticles = 35;

  // Particle Class
  class Particle {
    constructor(x, y, isExplosion = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      this.size = Math.random() * 12 + 8;
      this.type = Math.random() > 0.4 ? 'heart' : 'petal';
      this.color = Math.random() > 0.5 ? '#ff3e85' : '#ff6ba3';
      this.opacity = Math.random() * 0.7 + 0.3;

      if (isExplosion) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.1;
        this.decay = Math.random() * 0.015 + 0.008;
      } else {
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 1 + 0.5);
        this.gravity = 0;
        this.decay = 0;
      }

      this.rotation = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.vRot;

      if (this.decay > 0) {
        this.opacity -= this.decay;
      } else {
        // Wrap around ambient particles
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        // Draw Heart Shape
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw Petal Shape
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size / 2, this.size / 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Populate initial ambient particles
  for (let i = 0; i < maxAmbientParticles; i++) {
    particles.push(new Particle());
  }

  // Expose Burst function globally
  window.spawnCelebrationBurst = (x, y, count = 60) => {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, true));
    }
  };

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();

      // Remove dead explosion particles
      if (p.decay > 0 && p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
