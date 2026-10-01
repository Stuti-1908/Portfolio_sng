// Nav state + mobile menu
const nav = document.querySelector('.nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 20);
let st = 0; addEventListener('scroll', () => { if (!st) st = requestAnimationFrame(() => { st = 0; onScroll(); }); }, { passive: true }); onScroll();
const burger = document.querySelector('.burger'), links = document.querySelector('.nav-links');
burger && burger.addEventListener('click', () => links.classList.toggle('open'));

// Split headline words for reveal
const splits = [...document.querySelectorAll('.split')];
splits.slice(1).forEach(el => { el.classList.remove('split'); el.classList.add('rv'); });
splits.slice(0, 1).forEach(el => {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(t); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.textContent = t; w.append(i); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
    });
  };
  walk(el);
  el.querySelectorAll('.w>span').forEach((s, i) => s.style.transitionDelay = (i * 0.03) + 's');
});

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv,.split').forEach(el => io.observe(el));

// Count-up numbers
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
  const t0 = performance.now(), dur = 1600;
  const tick = now => {
    const k = Math.min((now - t0) / dur, 1), v = end * (1 - Math.pow(1 - k, 4));
    el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick); cio.unobserve(el);
}), { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// Spotlight on stages
document.querySelectorAll('.stage').forEach(s => {
  let raf = 0;
  s.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0; const r = s.getBoundingClientRect();
      s.style.setProperty('--mx', (e.clientX - r.left) + 'px'); s.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }, { passive: true });
});

// Filters (work + credentials)
document.querySelectorAll('[data-filter-group]').forEach(bar => {
  const items = document.querySelectorAll(bar.dataset.filterGroup);
  bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    bar.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
    const f = b.dataset.f;
    items.forEach(it => it.classList.toggle('hide', f !== 'all' && !(' ' + it.dataset.tags + ' ').includes(' ' + f + ' ')));
  }));
});

// Lightbox
const lb = document.querySelector('.lightbox');
if (lb) {
  document.querySelectorAll('.cert').forEach(c => c.addEventListener('click', () => {
    lb.querySelector('img').src = c.querySelector('img').src;
    lb.querySelector('p').textContent = c.querySelector('b').textContent;
    lb.classList.add('on');
  }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));
}

// Voice waveform bars
document.querySelectorAll('.wave').forEach(w => {
  for (let i = 0; i < 34; i++) {
    const b = document.createElement('i');
    b.style.height = (8 + Math.abs(Math.sin(i * 0.7)) * 34) + 'px';
    b.style.animationDelay = (i * 0.04) + 's'; w.append(b);
  }
});

// Globe (home) — cobe WebGL, recoloured per theme, graceful fallback to static sphere
const gc = document.getElementById('globe');
let globe = null, createGlobe = null, globeVisible = true;
if (gc) new IntersectionObserver(es => es.forEach(e => globeVisible = e.isIntersecting)).observe(gc);
const isDark = () => document.documentElement.dataset.theme === 'dark';
function drawGlobe() {
  if (!gc || !createGlobe) return;
  globe && globe.destroy();
  let phi = 0.9;
  const size = Math.round(gc.offsetWidth * 1.5), dark = isDark();
  globe = createGlobe(gc, {
    devicePixelRatio: 1.5, width: size, height: size, phi, theta: 0.28, dark: dark ? 1 : 0, diffuse: dark ? 1.25 : 1.1,
    mapSamples: 9000, mapBrightness: dark ? 5.5 : 2.2,
    baseColor: dark ? [0.12, 0.14, 0.24] : [0.93, 0.95, 1], markerColor: dark ? [0.65, 0.7, 1] : [0.31, 0.27, 0.9],
    glowColor: dark ? [0.2, 0.25, 0.5] : [0.85, 0.88, 1],
    markers: [
      { location: [40.71, -74.0], size: 0.07 },   // New York
      { location: [38.83, -104.82], size: 0.05 }, // Colorado Springs
      { location: [25.2, 55.27], size: 0.08 },    // Dubai
      { location: [48.85, 2.35], size: 0.06 },    // Europe
      { location: [18.52, 73.86], size: 0.05 },   // Pune
      { location: [23.22, 72.65], size: 0.06 },   // Gandhinagar
    ],
    onRender: s => { if (globeVisible && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) phi += 0.0035; s.phi = phi; }
  });
  gc.classList.add('on');
  document.querySelector('.globe-fallback')?.remove();
}
if (gc) (window.requestIdleCallback || (f => setTimeout(f, 600)))(() => import('https://cdn.jsdelivr.net/npm/cobe@0.6.3/+esm').then(m => { createGlobe = m.default; drawGlobe(); }).catch(() => {}), { timeout: 2500 });

// Theme toggle (light default, choice remembered)
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  if (next === 'dark') document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme;
  try { localStorage.setItem('theme', next); } catch (e) {}
  drawGlobe();
});

// Scale fixed-size mockup scenes to their container (reads batched, then writes)
const fitAll = () => {
  const boxes = [...document.querySelectorAll('.fit')];
  boxes.forEach(box => { const el = box.firstElementChild; if (el) el.style.transform = 'none'; });
  const m = boxes.map(box => {
    const el = box.firstElementChild; if (!el) return null;
    const w = el.offsetWidth, h = el.offsetHeight, crop = box.classList.contains('crop');
    const ps = getComputedStyle(box.parentElement);
    const avail = box.parentElement.clientWidth - (parseFloat(ps.paddingLeft) + parseFloat(ps.paddingRight)) - (crop ? 32 : 0);
    return { box, el, w, h, crop, avail, bw: box.clientWidth };
  });
  m.forEach(o => {
    if (!o) return;
    const s = Math.min(o.crop ? 0.72 : 1, o.avail / o.w);
    o.el.style.transform = `scale(${s})`;
    o.el.style.left = Math.max(0, (o.bw - o.w * s) / 2) + 'px';
    if (!o.crop) o.box.style.height = o.h * s + 'px';
  });
};
let fitT; const fitSoon = () => { clearTimeout(fitT); fitT = setTimeout(fitAll, 120); };
addEventListener('resize', fitSoon); addEventListener('load', fitAll); fitAll();
document.fonts && document.fonts.ready.then(fitAll);
document.querySelectorAll(".fit img").forEach(i => i.complete ? fitAll() : i.addEventListener("load", fitAll));

// Case-study subnav: highlight the section in view
const snLinks = [...document.querySelectorAll('.subnav a')];
if (snLinks.length) {
  const sio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) snLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  snLinks.forEach(a => { const t = document.querySelector(a.getAttribute('href')); t && sio.observe(t); });
}


// ---------- v2 interactivity ----------
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// scroll progress bar
const bar = document.querySelector('.progress');
if (bar) { let pt = 0; const p = () => { pt = 0; bar.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`; }; addEventListener('scroll', () => { if (!pt) pt = requestAnimationFrame(p); }, { passive: true }); p(); }
// card tilt + cursor glow, magnetic buttons
if (!reduce && matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.pcard').forEach(c => {
    let raf = 0;
    c.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
        c.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-3px)`;
      });
    }, { passive: true });
    c.addEventListener('pointerleave', () => c.style.transform = '');
  });
  document.querySelectorAll('.btn').forEach(b => {
    b.classList.add('magnetic');
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });
}
// project quick view
const qv = document.querySelector('.qv');
if (qv) {
  const vis = qv.querySelector('.qv-vis'), body = qv.querySelector('.qv-body');
  const close = () => qv.classList.remove('on');
  document.querySelectorAll('.pcard .qv-btn').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const c = btn.closest('.pcard');
    vis.innerHTML = c.querySelector('.thumb .fit').outerHTML;
    body.innerHTML = `<div class="eyebrow">${c.querySelector('.body .meta').textContent}</div><h3>${c.querySelector('.body h3').textContent}</h3><p>${c.querySelector('.body p').textContent}</p>${c.querySelector('.body .tags').outerHTML}<div class="qv-actions"><a class="btn btn-gold" href="${c.getAttribute('href')}">Read the case study <span class="arr">→</span></a></div>`;
    qv.classList.add('on'); fitAll();
  }));
  qv.addEventListener('click', e => { if (e.target === qv) close(); });
  qv.querySelector('.qv-x').addEventListener('click', close);
  addEventListener('keydown', e => e.key === 'Escape' && close());
}

// pause looping animations (mockups, marquee) while off screen
const pio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('off', !e.isIntersecting)), { rootMargin: '120px' });
document.querySelectorAll('.fit,.marquee').forEach(el => pio.observe(el));

// contact form
const cf = document.getElementById('contact-form');
if (cf) {
  const topic = new URLSearchParams(location.search).get('topic');
  if (topic && cf.topic) [...cf.topic.options].forEach(o => { if (o.value === topic) cf.topic.value = topic; });
  const err = cf.querySelector('.cform-err'), btn = cf.querySelector('button'), lbl = btn.querySelector('.lbl');
  cf.addEventListener('submit', async e => {
    e.preventDefault(); err.hidden = true;
    const f = Object.fromEntries(new FormData(cf));
    let bad = false;
    ['name', 'email', 'message'].forEach(k => {
      const ok = k === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f[k] || '') : (f[k] || '').trim().length >= (k === 'message' ? 10 : 2);
      cf[k].setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok) bad = true;
    });
    if (bad) { err.textContent = 'Please check the highlighted fields.'; err.hidden = false; return; }
    if (f._honey) return;
    btn.disabled = true; lbl.textContent = 'Sending…';
    try {
      const res = await fetch(cf.dataset.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: f.name, email: f.email, topic: f.topic, message: f.message,
          _subject: `Portfolio enquiry from ${f.name}`, _replyto: f.email, _template: 'table', _captcha: 'false',
          _autoresponse: 'Thank you for getting in touch. I have received your message and will reply within 24 hours. - Stuti Gohil' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === 'false') throw new Error(data.message || 'failed');
      cf.hidden = true; document.getElementById('contact-ok').hidden = false;
      document.querySelector('.cside')?.classList.add('in');
      scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      err.textContent = 'Could not send right now. Please email me directly at ' + (document.querySelector('.cside a')?.textContent || '') + '.';
      err.hidden = false; btn.disabled = false; lbl.textContent = 'Send message';
    }
  });
}
