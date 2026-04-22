/* ===================================================
   AKRAM SAIDANI — PORTFOLIO · main.js
   =================================================== */

/* === THEME === */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', saved || preferred);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme Toggle ── */
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ── Custom Cursor — data-plot crosshair (desktop only) ── */
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const cursor = document.getElementById('cursor');

    window.addEventListener('mousemove', e => {
      cursor.classList.add('is-visible');
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    window.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    window.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));

    document.querySelectorAll('a, button, .proj-card, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

  /* ── Navigation Scroll State + Auto-Hide + Progress Bar ── */
  const nav = document.getElementById('nav');
  const progressFill = document.getElementById('nav-progress-fill');
  let lastScrollY = window.scrollY;

  function updateNav() {
    const current = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    nav.classList.toggle('scrolled', current > 40);

    if (current > lastScrollY && current > 80) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastScrollY = current;

    if (progressFill && total > 0) {
      progressFill.style.width = ((current / total) * 100) + '%';
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Active Nav Link on Scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ── Mobile Menu ── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('menu-close');

  function openMenu() {
    mobileMenu.removeAttribute('hidden');
    setTimeout(() => mobileMenu.classList.add('is-open'), 10);
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose.focus();
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => mobileMenu.setAttribute('hidden', ''), 400);
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
  });

  /* ── Terminal Typewriter ── */
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    const LINES = [
      { type: 'cmd',      text: '$ ./profile --load akram.saidani' },
      { type: 'blank' },
      { type: 'output',   text: 'Initializing data profile...' },
      { type: 'progress', text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%' },
      { type: 'blank' },
      { type: 'kv',       key: 'NAME    ', val: 'Akram Saidani' },
      { type: 'kv',       key: 'ROLE    ', val: 'Data Scientist / Data Analyst' },
      { type: 'kv',       key: 'LOC     ', val: 'Paris, France' },
      { type: 'kv',       key: 'EDU     ', val: 'M2 @ Université Paris-Saclay' },
      { type: 'blank' },
      { type: 'kv',       key: 'STACK   ', val: 'Python · R · SQL · TensorFlow · PyTorch' },
      { type: 'kv',       key: 'DOMAINS ', val: 'ML · Deep Learning · NLP · Computer Vision' },
      { type: 'blank' },
      { type: 'status',   text: 'STATUS   Open to opportunities  ✓' },
    ];

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CHAR_DELAY = REDUCED ? 0 : 18;
    const LINE_DELAY = REDUCED ? 0 : 120;

    let cursorEl = null;

    function addCursor() {
      if (cursorEl) cursorEl.remove();
      cursorEl = document.createElement('span');
      cursorEl.className = 'terminal-cursor';
      terminalBody.appendChild(cursorEl);
    }

    function removeCursor() {
      if (cursorEl) { cursorEl.remove(); cursorEl = null; }
    }

    function addLine(cls, text) {
      const el = document.createElement('span');
      el.className = `terminal-line terminal-line--${cls}`;
      el.textContent = text;
      terminalBody.appendChild(el);
      return el;
    }

    function typeText(el, text, charDelay) {
      return new Promise(resolve => {
        let i = 0;
        function next() {
          if (i < text.length) {
            el.textContent += text[i++];
            addCursor();
            setTimeout(next, charDelay + Math.random() * 8);
          } else {
            resolve();
          }
        }
        next();
      });
    }

    async function runTerminal() {
      addCursor();
      for (const line of LINES) {
        await new Promise(r => setTimeout(r, LINE_DELAY));
        removeCursor();

        if (line.type === 'blank') {
          addLine('output', '');
          continue;
        }

        if (line.type === 'cmd') {
          const el = addLine('cmd', '');
          await typeText(el, line.text, CHAR_DELAY);
          continue;
        }

        if (line.type === 'output') {
          const el = addLine('output', '');
          await typeText(el, line.text, CHAR_DELAY * 0.5);
          continue;
        }

        if (line.type === 'progress') {
          const el = addLine('progress', '');
          await typeText(el, line.text, CHAR_DELAY * 0.3);
          continue;
        }

        if (line.type === 'kv') {
          const el = document.createElement('span');
          el.className = 'terminal-line';
          terminalBody.appendChild(el);
          const keyEl = document.createElement('span');
          keyEl.className = 'terminal-line--key';
          keyEl.textContent = line.key;
          el.appendChild(keyEl);
          const valEl = document.createElement('span');
          valEl.className = 'terminal-line--val';
          el.appendChild(valEl);
          await typeText(valEl, line.val, CHAR_DELAY * 0.6);
          continue;
        }

        if (line.type === 'status') {
          const el = addLine('status', '');
          await typeText(el, line.text, CHAR_DELAY * 0.7);
          continue;
        }
      }
      addCursor();
    }

    runTerminal();
  }

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll Animations (data-aos) ── */
  const aosEls = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  aosEls.forEach(el => aosObserver.observe(el));

  /* ── Skill Bars Animation ── */
  const skillFills = document.querySelectorAll('.skill-item__fill');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(el => skillObserver.observe(el));

  /* ── Force-Directed Skill Graph (Canvas) ── */
  const skillGraph = document.getElementById('skill-graph');
  if (skillGraph) {
    const gctx = skillGraph.getContext('2d');
    let GW = 0, GH = 0, graphRaf = null, graphRunning = false, hoveredNode = null;

    const CLUSTER_RGB = {
      ml:     [12,  240, 122],
      viz:    [245, 166, 35 ],
      db:     [91,  138, 240],
      domain: [200, 100, 240],
    };

    const NODES = [
      { id: 'python',  label: 'Python',          pct: 90, cluster: 'ml'     },
      { id: 'r',       label: 'R',               pct: 85, cluster: 'ml'     },
      { id: 'sklearn', label: 'Scikit-learn',    pct: 88, cluster: 'ml'     },
      { id: 'tf',      label: 'TensorFlow',      pct: 80, cluster: 'ml'     },
      { id: 'torch',   label: 'PyTorch',         pct: 80, cluster: 'ml'     },
      { id: 'mpl',     label: 'Matplotlib',      pct: 95, cluster: 'viz'    },
      { id: 'tableau', label: 'Tableau',         pct: 80, cluster: 'viz'    },
      { id: 'plotly',  label: 'Plotly',          pct: 80, cluster: 'viz'    },
      { id: 'powerbi', label: 'Power BI',        pct: 70, cluster: 'viz'    },
      { id: 'sql',     label: 'SQL',             pct: 90, cluster: 'db'     },
      { id: 'azure',   label: 'Azure',           pct: 70, cluster: 'db'     },
      { id: 'mongodb', label: 'MongoDB',         pct: 60, cluster: 'db'     },
      { id: 'nlp',     label: 'NLP',             pct: 77, cluster: 'domain' },
      { id: 'cv',      label: 'Comp. Vision',    pct: 80, cluster: 'domain' },
      { id: 'dl',      label: 'Deep Learning',   pct: 80, cluster: 'domain' },
      { id: 'stats',   label: 'Statistics',      pct: 92, cluster: 'domain' },
    ].map(n => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }));

    const EDGES = [
      ['python','sklearn'],['python','tf'],['python','torch'],['python','r'],
      ['python','plotly'], ['python','sql'], ['python','cv'],
      ['tf','dl'],['torch','dl'],['sklearn','stats'],
      ['dl','nlp'],['dl','cv'],['nlp','cv'],
      ['stats','mpl'],['mpl','plotly'],
      ['tableau','powerbi'],['azure','sql'],
    ];

    function clusterCenters() {
      return {
        ml:     { x: GW * 0.27, y: GH * 0.30 },
        viz:    { x: GW * 0.73, y: GH * 0.28 },
        db:     { x: GW * 0.70, y: GH * 0.72 },
        domain: { x: GW * 0.27, y: GH * 0.70 },
      };
    }

    function initGraphPositions() {
      const cc = clusterCenters();
      NODES.forEach(n => {
        const c = cc[n.cluster];
        n.x = c.x + (Math.random() - 0.5) * 80;
        n.y = c.y + (Math.random() - 0.5) * 80;
        n.vx = 0; n.vy = 0;
      });
    }

    function simulateGraph() {
      const cc = clusterCenters();
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const dx = NODES[i].x - NODES[j].x || 0.01;
          const dy = NODES[i].y - NODES[j].y || 0.01;
          const d2 = dx * dx + dy * dy;
          const d  = Math.sqrt(d2) || 1;
          const f  = Math.min(3200 / d2, 6);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          NODES[i].vx += fx; NODES[i].vy += fy;
          NODES[j].vx -= fx; NODES[j].vy -= fy;
        }
      }
      EDGES.forEach(([aId, bId]) => {
        const a = NODES.find(n => n.id === aId);
        const b = NODES.find(n => n.id === bId);
        const dx = b.x - a.x, dy = b.y - a.y;
        const d  = Math.sqrt(dx * dx + dy * dy) || 1;
        const f  = (d - 72) * 0.055;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      });
      NODES.forEach(n => {
        const c = cc[n.cluster];
        n.vx += (c.x - n.x) * 0.038 + (GW / 2 - n.x) * 0.003;
        n.vy += (c.y - n.y) * 0.038 + (GH / 2 - n.y) * 0.003;
        n.vx *= 0.80; n.vy *= 0.80;
        n.x = Math.max(52, Math.min(GW - 52, n.x + n.vx));
        n.y = Math.max(28, Math.min(GH - 28, n.y + n.vy));
      });
    }

    function drawGraph() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      gctx.clearRect(0, 0, GW, GH);

      EDGES.forEach(([aId, bId]) => {
        const a = NODES.find(n => n.id === aId);
        const b = NODES.find(n => n.id === bId);
        const active = hoveredNode && (hoveredNode.id === aId || hoveredNode.id === bId);
        gctx.beginPath();
        gctx.moveTo(a.x, a.y);
        gctx.lineTo(b.x, b.y);
        gctx.strokeStyle = active
          ? 'rgba(12,240,122,0.50)'
          : (isDark ? 'rgba(88,130,162,0.24)' : 'rgba(80,100,120,0.26)');
        gctx.lineWidth = active ? 1.4 : 0.7;
        gctx.stroke();
      });

      NODES.forEach(n => {
        const [r, g, b] = CLUSTER_RGB[n.cluster];
        const radius = 5 + (n.pct / 100) * 5.5;
        const isHov  = hoveredNode === n;

        if (isHov) {
          gctx.beginPath();
          gctx.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
          gctx.fillStyle = `rgba(${r},${g},${b},0.10)`;
          gctx.fill();
        }

        gctx.beginPath();
        gctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        gctx.fillStyle   = `rgba(${r},${g},${b},${isHov ? 0.22 : 0.08})`;
        gctx.strokeStyle = `rgba(${r},${g},${b},${isHov ? 0.95 : 0.55})`;
        gctx.lineWidth   = isHov ? 2 : 1.5;
        gctx.fill();
        gctx.stroke();

        if (isHov) {
          gctx.font = '600 11px "JetBrains Mono", monospace';
          gctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
          gctx.textAlign = 'center';
          gctx.fillText(`${n.pct}%`, n.x, n.y + 4);
        }

        gctx.font = `${isHov ? '600' : '400'} ${isHov ? 9.5 : 8.5}px "JetBrains Mono", monospace`;
        gctx.fillStyle = isDark
          ? `rgba(200,216,232,${isHov ? 0.95 : 0.60})`
          : `rgba(26,37,53,${isHov ? 0.95 : 0.65})`;
        gctx.textAlign = 'center';
        gctx.fillText(n.label, n.x, n.y + radius + 13);
      });
    }

    function graphTick() {
      simulateGraph();
      drawGraph();
      graphRaf = requestAnimationFrame(graphTick);
    }

    function resizeGraph() {
      GW = skillGraph.width  = skillGraph.offsetWidth;
      GH = skillGraph.height = skillGraph.offsetHeight || 400;
      initGraphPositions();
    }

    skillGraph.addEventListener('mousemove', e => {
      const rect = skillGraph.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      hoveredNode = NODES.find(n => {
        const dx = n.x - mx, dy = n.y - my;
        return Math.sqrt(dx * dx + dy * dy) < 18;
      }) || null;
      skillGraph.style.cursor = hoveredNode ? 'pointer' : '';
    });
    skillGraph.addEventListener('mouseleave', () => { hoveredNode = null; });

    const graphObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !graphRunning) {
          graphRunning = true;
          resizeGraph();
          graphRaf = requestAnimationFrame(graphTick);
        }
      });
    }, { threshold: 0.1 });
    graphObserver.observe(skillGraph);

    window.addEventListener('resize', () => {
      if (graphRunning) resizeGraph();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && graphRaf) { cancelAnimationFrame(graphRaf); graphRaf = null; }
      else if (!document.hidden && graphRunning && !graphRaf) graphRaf = requestAnimationFrame(graphTick);
    });
  }

  /* ── Project Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      projCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ── Neural Network Canvas (Hero Background) ── */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas && !REDUCED_MOTION) {
    const nctx  = heroCanvas.getContext('2d');
    let NW = 0, NH = 0, netRaf = null;
    const NODE_N = 85, LINK_DIST = 160;
    let netMouse = { x: -9999, y: -9999 };

    class NetNode {
      constructor() {
        this.x     = Math.random() * NW;
        this.y     = Math.random() * NH;
        this.vx    = (Math.random() - 0.5) * 0.42;
        this.vy    = (Math.random() - 0.5) * 0.42;
        this.r     = Math.random() * 1.6 + 0.8;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.phase += 0.017;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > NW) this.vx *= -1;
        if (this.y < 0 || this.y > NH) this.vy *= -1;
        const dx = this.x - netMouse.x, dy = this.y - netMouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1;
          this.x += (dx / d) * 2;
          this.y += (dy / d) * 2;
        }
      }
      draw(cr, cg, cb) {
        const alpha = 0.45 + Math.sin(this.phase) * 0.3;
        nctx.beginPath();
        nctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        nctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        nctx.fill();
      }
    }

    let netNodes = [];

    function getNetColor() {
      return document.documentElement.getAttribute('data-theme') === 'light'
        ? [0, 122, 62] : [12, 240, 122];
    }

    function resizeNet() {
      NW = heroCanvas.width  = heroCanvas.offsetWidth;
      NH = heroCanvas.height = heroCanvas.offsetHeight;
      if (!netNodes.length) {
        for (let i = 0; i < NODE_N; i++) netNodes.push(new NetNode());
      }
    }

    function netTick() {
      nctx.clearRect(0, 0, NW, NH);
      const [cr, cg, cb] = getNetColor();
      const time = Date.now() * 0.001;

      // 1. Draw Links between nodes
      for (let i = 0; i < netNodes.length; i++) {
        for (let j = i + 1; j < netNodes.length; j++) {
          const dx = netNodes[i].x - netNodes[j].x;
          const dy = netNodes[i].y - netNodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / LINK_DIST) * 0.28;
            nctx.beginPath();
            nctx.moveTo(netNodes[i].x, netNodes[i].y);
            nctx.lineTo(netNodes[j].x, netNodes[j].y);
            nctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            nctx.lineWidth   = 0.6;
            nctx.stroke();

            // Periodic Pulse
            if ((i + j) % 12 === 0) {
              const pulsePos = (time + (i * 0.1)) % 1;
              const px = netNodes[i].x + (netNodes[j].x - netNodes[i].x) * pulsePos;
              const py = netNodes[i].y + (netNodes[j].y - netNodes[i].y) * pulsePos;
              nctx.beginPath();
              nctx.arc(px, py, 1.2, 0, Math.PI * 2);
              nctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha * 1.5})`;
              nctx.fill();
            }
          }
        }
      }

      // 2. Draw Mouse-to-Node Links (Interaction)
      if (netMouse.x > -1000) {
        netNodes.forEach((n, idx) => {
          const dx = n.x - netMouse.x, dy = n.y - netMouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 40000) { // 200px radius
            const d = Math.sqrt(d2);
            const mAlpha = (1 - d / 200) * 0.35;
            nctx.beginPath();
            nctx.moveTo(n.x, n.y);
            nctx.lineTo(netMouse.x, netMouse.y);
            nctx.strokeStyle = `rgba(${cr},${cg},${cb},${mAlpha})`;
            nctx.lineWidth = 0.8;
            nctx.stroke();

            // Pulse towards mouse
            if (idx % 3 === 0) {
                const mp = (time * 1.5 + idx) % 1;
                const mpx = n.x + (netMouse.x - n.x) * mp;
                const mpy = n.y + (netMouse.y - n.y) * mp;
                nctx.beginPath();
                nctx.arc(mpx, mpy, 1.5, 0, Math.PI * 2);
                nctx.fillStyle = `rgba(${cr},${cg},${cb},${mAlpha * 2})`;
                nctx.fill();
            }
          }
        });
      }

      netNodes.forEach(n => { n.update(); n.draw(cr, cg, cb); });
      netRaf = requestAnimationFrame(netTick);
    }

    window.addEventListener('mousemove', e => {
      const rect = heroCanvas.getBoundingClientRect();
      netMouse.x = e.clientX - rect.left;
      netMouse.y = e.clientY - rect.top;
    }, { passive: true });

    document.getElementById('accueil')
      ?.addEventListener('mouseleave', () => { netMouse = { x: -9999, y: -9999 }; });

    window.addEventListener('resize', resizeNet, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && netRaf) { cancelAnimationFrame(netRaf); netRaf = null; }
      else if (!document.hidden && !netRaf) netRaf = requestAnimationFrame(netTick);
    });

    resizeNet();
    netRaf = requestAnimationFrame(netTick);
  }

  /* ── 3D Magnetic Tilt + Glow on Project Cards ── */
  if (!REDUCED_MOTION && window.matchMedia('(min-width: 1024px)').matches) {
    document.querySelectorAll('.proj-card').forEach(card => {
      const glow = document.createElement('div');
      glow.className = 'card-glow';
      card.insertBefore(glow, card.firstChild);
      card.classList.add('js-tilt');

      let raf;
      card.addEventListener('mousemove', e => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x  = e.clientX - rect.left, y  = e.clientY - rect.top;
          const cx = rect.width / 2,         cy = rect.height / 2;
          const rX = ((y - cy) / cy) * -5;
          const rY = ((x - cx) / cx) *  7;
          card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(6px)`;
          glow.style.background = `radial-gradient(circle 180px at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, rgba(12,240,122,0.09), transparent 70%)`;
          glow.style.opacity = '1';
        });
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        card.style.transform = '';
        glow.style.opacity = '0';
      });
    });
  }

  /* ── Text Scramble on Section Titles ── */
  if (!REDUCED_MOTION) {
    const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    function scrambleEl(el) {
      const saved = el.innerHTML;
      const plain = el.innerText;
      let f = 0;
      const total = plain.length * 3;
      const iv = setInterval(() => {
        el.textContent = plain.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < Math.floor(f / 3)) return ch;
          return SC[Math.floor(Math.random() * SC.length)];
        }).join('');
        if (++f > total) { clearInterval(iv); el.innerHTML = saved; }
      }, 26);
    }
    const scObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { scrambleEl(e.target); scObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('.section__title').forEach(t => scObs.observe(t));
  }

  /* ── React: Live Model Training Monitor ── */
  if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    const metricsMount = document.getElementById('metrics-root');
    if (metricsMount && !REDUCED_MOTION) {
      function LiveMonitor() {
        const [st, setSt] = React.useState({
          acc: 0.312, loss: 2.441, sps: 1024, epoch: 1, hist: [],
        });
        const [flash, setFlash] = React.useState([]);

        React.useEffect(() => {
          const id = setInterval(() => {
            setSt(p => {
              const acc   = Math.min(0.968, p.acc + Math.random() * 0.012);
              const loss  = Math.max(0.072, p.loss * (0.971 + Math.random() * 0.013));
              const sps   = Math.floor(900 + Math.random() * 550);
              const epoch = Math.min(48, p.epoch + (Math.random() > 0.55 ? 1 : 0));
              const hist  = [...p.hist.slice(-19), acc * 100];
              return { acc, loss, sps, epoch, hist };
            });
            // Random synapse flash
            if (Math.random() > 0.6) {
              setFlash(Array.from({length: 3}, () => Math.floor(Math.random() * 8)));
              setTimeout(() => setFlash([]), 150);
            }
          }, 420);
          return () => clearInterval(id);
        }, []);

        const { acc, loss, sps, epoch, hist } = st;
        const done = acc >= 0.95;
        const W = 220, H = 38;
        const pts = hist.length > 1
          ? hist.map((v, i) => {
              const x = (i / (hist.length - 1)) * W;
              const y = H - (v / 100) * (H - 4) - 2;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ')
          : null;

        // Simple Neural Network Visualization Nodes
        const nodes = [
          {x: 10, y: 10}, {x: 10, y: 25}, {x: 10, y: 40}, // Input
          {x: 35, y: 15}, {x: 35, y: 35}, // Hidden
          {x: 60, y: 25} // Output
        ];
        const links = [
          [0,3],[1,3],[2,3], [0,4],[1,4],[2,4],
          [3,5],[4,5]
        ];

        return React.createElement('div', { className: 'lm' },
          React.createElement('div', { className: 'lm__bar' },
            React.createElement('div', { className: 'terminal__dots' },
              React.createElement('span', { className: 'terminal__dot terminal__dot--red' }),
              React.createElement('span', { className: 'terminal__dot terminal__dot--yellow' }),
              React.createElement('span', { className: 'terminal__dot terminal__dot--green' })
            ),
            React.createElement('span', { className: 'lm__title' }, 'training.log')
          ),
          React.createElement('div', { className: 'lm__body' },
            React.createElement('div', { className: 'lm__header' },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                // Mini Neural SVG
                React.createElement('svg', { width: 70, height: 50, style: { opacity: 0.8 } },
                  links.map(([from, to], i) => React.createElement('line', {
                    key: `l-${i}`,
                    x1: nodes[from].x, y1: nodes[from].y,
                    x2: nodes[to].x, y2: nodes[to].y,
                    stroke: flash.includes(i) ? 'var(--accent)' : 'var(--border)',
                    strokeWidth: flash.includes(i) ? 1.5 : 1,
                    style: { transition: 'stroke 0.1s' }
                  })),
                  nodes.map((n, i) => React.createElement('circle', {
                    key: `n-${i}`,
                    cx: n.x, cy: n.y, r: 2.5,
                    fill: 'var(--bg-surface)',
                    stroke: 'var(--accent)',
                    strokeWidth: 1
                  }))
                ),
                React.createElement('span', { className: 'lm__cmd' }, '$ model.fit(X_train, y_train)')
              ),
              React.createElement('span', { className: `lm__badge ${done ? 'lm__badge--done' : 'lm__badge--run'}` },
                done ? '● DONE' : '● TRAINING'
              )
            ),
            pts && React.createElement('div', { className: 'lm__chart' },
              React.createElement('svg', { width: '100%', height: H, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' },
                React.createElement('defs', null,
                  React.createElement('linearGradient', { id: 'lmg', x1: '0', y1: '0', x2: '0', y2: '1' },
                    React.createElement('stop', { offset: '0%',   stopColor: 'var(--accent)', stopOpacity: '0.22' }),
                    React.createElement('stop', { offset: '100%', stopColor: 'var(--accent)', stopOpacity: '0'    })
                  )
                ),
                React.createElement('polygon', { points: `0,${H} ${pts} ${W},${H}`, fill: 'url(#lmg)' }),
                React.createElement('polyline', {
                  points: pts, fill: 'none',
                  stroke: 'var(--accent)', strokeWidth: '1.5',
                  strokeLinejoin: 'round', strokeLinecap: 'round',
                })
              )
            ),
            React.createElement('div', { className: 'lm__stats' },
              ...[ ['accuracy', `${(acc * 100).toFixed(1)}%`],
                   ['val_loss', loss.toFixed(3)],
                   ['epoch',    `${epoch}/48`],
                   ['samples/s', sps],
              ].map(([lbl, val]) =>
                React.createElement('div', { className: 'lm__stat', key: lbl },
                  React.createElement('span', { className: 'lm__val' }, val),
                  React.createElement('span', { className: 'lm__lbl' }, lbl)
                )
              )
            )
          )
        );
      }

      ReactDOM.createRoot(metricsMount).render(React.createElement(LiveMonitor));
    }
  }

});
