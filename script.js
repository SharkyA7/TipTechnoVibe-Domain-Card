(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Konfigurasi utama
  const CONFIG = {
    count:          80,     // jumlah partikel
    maxRadius:      2.2,    // radius max titik (px)
    minRadius:      0.6,
    speedMax:       0.28,   // kecepatan maksimal
    connectDist:    110,    // jarak koneksi antar partikel
    mouseRadius:    130,    // radius pengaruh mouse
    mouseStrength:  0.045,  // kekuatan dorongan mouse
    // Warna partikel: cyan + sedikit pink
    colors: [
      'rgba(0, 255, 255, {a})',
      'rgba(0, 220, 255, {a})',
      'rgba(255, 0, 170, {a})',
      'rgba(180, 0, 255, {a})',
    ],
  };

  let W = 0, H = 0;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let rafId = null;

  /* ── Resize handler ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Random helpers ── */
  function rand(min, max) { return min + Math.random() * (max - min); }
  function randColor(alpha) {
    const template = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    return template.replace('{a}', alpha.toFixed(2));
  }

  /* ── Create single particle ── */
  function createParticle(x, y) {
    const alpha = rand(0.15, 0.65);
    return {
      x: x ?? rand(0, W),
      y: y ?? rand(0, H),
      vx: rand(-CONFIG.speedMax, CONFIG.speedMax),
      vy: rand(-CONFIG.speedMax, CONFIG.speedMax),
      r: rand(CONFIG.minRadius, CONFIG.maxRadius),
      alpha,
      baseAlpha: alpha,
      color: randColor(alpha),
      life: 0,
      maxLife: rand(280, 600),
    };
  }

  /* ── Initialise pool ── */
  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      const p = createParticle();
      // Stagger life so they don't all die at once
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }
  }

  /* ── Draw a connecting line between two particles ── */
  function drawLine(a, b, opacity) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    // Blend cyan→pink based on relative position
    const blend = Math.abs(a.x - b.x) / W;
    ctx.strokeStyle = `rgba(${Math.round(blend * 255)}, ${Math.round((1-blend)*255)}, 255, ${opacity * 0.18})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  /* ── Main animation loop ── */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life++;

      // Respawn when life ends
      if (p.life >= p.maxLife) {
        particles[i] = createParticle();
        continue;
      }

      // Fade in / out based on life progress
      const progress = p.life / p.maxLife;
      const fade = progress < 0.08
        ? progress / 0.08
        : progress > 0.88
          ? (1 - progress) / 0.12
          : 1;

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.vx += (dx / dist) * force * CONFIG.mouseStrength;
        p.vy += (dy / dist) * force * CONFIG.mouseStrength;
      }

      // Velocity damping (gradual slowdown back to natural speed)
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > CONFIG.speedMax * 2) {
        p.vx *= 0.96;
        p.vy *= 0.96;
      }

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges smoothly
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = randColor(p.baseAlpha * fade);
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const edist = Math.sqrt(ex * ex + ey * ey);
        if (edist < CONFIG.connectDist) {
          const lineOpacity = (1 - edist / CONFIG.connectDist) * fade;
          drawLine(p, q, lineOpacity);
        }
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  /* ── Mouse / Touch tracking ── */
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  // Reset mouse when out of window
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* ── Resize with debounce ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      init();
    }, 200);
  });

  /* ── Pause when tab hidden (battery saving) ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(loop);
    }
  });

  /* ── Start ── */
  resize();
  init();
  loop();
})();


/* ─────────────────────────────────────────
   GLASS CARD INTERACTIVE GLOW
   Spotlight effect mengikuti posisi kursor
───────────────────────────────────────── */

(function initCardGlow() {
  const card = document.querySelector('.glass-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `
      radial-gradient(
        circle at ${x}% ${y}%,
        rgba(0, 255, 255, 0.07) 0%,
        rgba(255, 255, 255, 0.03) 40%,
        rgba(255, 255, 255, 0.02) 100%
      )
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
})();


/* ─────────────────────────────────────────
   CHIP HOVER RIPPLE
   Efek ringan saat hover topic chips
───────────────────────────────────────── */

(function initChipEffects() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      chip.style.transform = 'scale(1.06) translateY(-1px)';
      chip.style.transition = 'transform .2s ease';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────
   BRAND NAME LETTER GLOW ON LOAD
   Animasi stagger masuk untuk setiap
   segmen nama brand
───────────────────────────────────────── */

(function initBrandEntrance() {
  const segments = document.querySelectorAll('.brand-tip, .brand-techno, .brand-vibe');
  segments.forEach((seg, i) => {
    seg.style.opacity = '0';
    seg.style.transform = 'translateY(12px)';
    seg.style.transition = `opacity .6s ${.3 + i * .18}s ease, transform .6s ${.3 + i * .18}s cubic-bezier(.2,1,.4,1)`;
    // Trigger
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        seg.style.opacity = '1';
        seg.style.transform = 'translateY(0)';
      });
    });
  });
})();
