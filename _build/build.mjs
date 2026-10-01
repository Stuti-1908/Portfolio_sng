// Static site generator: node _build/build.mjs  ->  writes HTML pages into the Portfolio root.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects, flagship, certs, moreCerts, owned } from './data.mjs';
import { mockups } from './mockups.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
const V = Date.now().toString(36);
const EMAIL = 'sng19.work@gmail.com', PHONE = '+91 63550 46464';


// ---------- issuer logos: Simple Icons paths (brand colour) or monogram badges ----------
const icon = (name, color) => {
  const f = join(ROOT, 'assets/logos', name + '.svg');
  if (!existsSync(f)) return '';
  const d = readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1];
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${color}" d="${d}"/></svg>`;
};
const mono = (txt, bg, fg = '#fff', serif = false) => `<span class="mono" style="background:${bg};color:${fg};${serif ? 'font-family:var(--serif);font-size:1.25em' : ''}">${txt}</span>`;
const LOGOS = [
  [/stanford/i, () => mono('S', '#8C1515', '#fff', true)],
  [/imperial/i, () => mono('IC', '#003E74')],
  [/deeplearning/i, () => mono('DL', '#F65B66')],
  [/oracle/i, () => icon('oracle', '#F80000')],
  [/google cloud/i, () => icon('googlecloud', '#4285F4')],
  [/google/i, () => icon('google', '#4285F4')],
  [/ibm/i, () => icon('ibm', '#054ADA')],
  [/github/i, () => icon('github', '#181717')],
  [/microsoft/i, () => icon('microsoft', '#5E5E5E')],
  [/aws|amazon/i, () => icon('amazonaws', '#FF9900')],
  [/mongodb/i, () => icon('mongodb', '#47A248')],
  [/cisco/i, () => icon('cisco', '#1BA0D7')],
  [/coursera/i, () => icon('coursera', '#0056D2')],
  [/udemy/i, () => icon('udemy', '#A435F0')],
  [/linkedin/i, () => icon('linkedin', '#0A66C2')],
  [/freecodecamp/i, () => icon('freecodecamp', '#0A0A23')],
  [/walmart/i, () => icon('walmart', '#0071CE')],
  [/goldman/i, () => mono('GS', '#7399C6')],
  [/hp/i, () => icon('hp', '#0096D6')],
  [/pepsi/i, () => icon('pepsi', '#2151A1')],
  [/infosys/i, () => icon('infosys', '#007CC3')],
  [/mckinsey/i, () => mono('M', '#051C2C', '#fff', true)],
  [/bcg/i, () => mono('BCG', '#29BA74')],
  [/who/i, () => mono('WHO', '#009ADE')],
  [/isro/i, () => mono('ISRO', '#F47216')],
  [/pmi/i, () => mono('PMI', '#4B2E83')],
  [/mathworks|matlab/i, () => mono('MW', '#0076A8')],
  [/adbi/i, () => mono('ADB', '#0070C0')],
  [/mlops/i, () => mono('ML', '#1E1E2A', '#6EF0C2')],
];
const logoFor = issuer => { const hit = LOGOS.find(([re]) => re.test(issuer)); return `<span class="logo">${hit ? hit[1]() : mono(issuer[0], '#333')}</span>`; };

const layout = ({ title, desc, active = '', depth = 0, body }) => {
  const r = depth ? '../' : '';
  const link = (href, label, key) => `<a href="${r}${href}" class="${active === key ? 'active' : ''}">${label}</a>`;
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${desc}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta name="theme-color" content="#07070A">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23D8B774'/%3E%3Ctext x='50%25' y='58%25' font-family='Georgia' font-size='34' text-anchor='middle' fill='%23111'%3ES%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}</script>
<link rel="stylesheet" href="${r}assets/css/site.css?v=${V}">
</head><body>
<div class="progress"></div>
<div class="qv" role="dialog" aria-modal="true" aria-label="Project preview"><div class="qv-card"><button class="qv-x" aria-label="Close">✕</button><div class="qv-vis"></div><div class="qv-body"></div></div></div>
<header class="nav"><div class="wrap">
  <a class="brand" href="${r}index.html"><span class="mark">S</span><span>Stuti Gohil<small>AI Engineer · Global AI Consultant</small></span></a>
  <div class="nav-tools"><button class="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode"><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button><button class="burger" aria-label="Menu">☰</button></div>
  <nav class="nav-links">${link('index.html', 'Home', 'home')}${link('work.html', 'Work', 'work')}${link('consulting.html', 'Consulting', 'consulting')}${link('credentials.html', 'Credentials', 'credentials')}<a class="cta-pill" href="mailto:${EMAIL}">Hire me</a></nav>
</div></header>
<main>${body.replaceAll("{{R}}", r)}</main>
${ctaBlock()}
<footer><div class="wrap"><span>© 2026 Stuti Gohil. Every project shown is real client work, delivered solo.</span>
<nav><a href="mailto:${EMAIL}">Email</a><a href="https://linkedin.com/in/stuti-gohil" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/Stuti-1908" target="_blank" rel="noopener">GitHub</a><a href="https://thesopbot.com" target="_blank" rel="noopener">thesopbot.com</a><a href="https://exoticlobby.com" target="_blank" rel="noopener">exoticlobby.com</a></nav></div></footer>
<script src="${r}assets/js/site.js?v=${V}" type="module"></script>
</body></html>`;
};

const ctaBlock = () => `<section class="cta-block">
  <div class="aura" style="width:700px;height:500px;left:50%;top:40%;translate:-50% -50%;background:rgba(79,70,229,.10)"></div>
  <div class="wrap"><span class="eyebrow">Open to full-time roles &amp; global engagements</span>
  <h2 class="h-xl split">Bring me the problem. I'll bring it to <span class="it">production.</span></h2>
  <div class="btns"><a class="btn btn-gold" href="mailto:${EMAIL}">${EMAIL} <span class="arr">→</span></a><a class="btn btn-ghost" href="https://linkedin.com/in/stuti-gohil" target="_blank" rel="noopener">Connect on LinkedIn ↗</a></div></div></section>`;

const tags = (arr, first) => `<div class="tags">${first || ''}${arr.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
const statusTag = p => `<span class="tag ${p.status === 'Live' ? 'live' : 'gold'}">${p.status === 'Live' ? '● ' : ''}${p.status}</span>`;
const fit = (html, cls = '') => `<div class="fit ${cls}">${html}</div>`;

const pcard = (p, depth = 0) => `<a class="pcard rv" href="${depth ? '' : 'work/'}${p.slug}.html" data-tags="${p.tags}">
  <div class="thumb">${fit(mockups[p.slug](), 'crop')}</div><button type="button" class="qv-btn">Quick view</button>
  <div class="body"><div class="meta">${p.client} · ${p.region}</div><h3>${p.title}</h3><p>${p.card}</p>${tags(p.chips.slice(0, 3), statusTag(p))}<span class="go">Read the case study <span class="arr">→</span></span></div></a>`;

// ================= HOME =================
const home = () => layout({
  title: 'Stuti Gohil · AI Engineer & Global AI Consultant', active: 'home',
  desc: 'AI Engineer and Global AI Consultant. Solo-built production AI products, iOS/Android apps and multi-agent systems for clients in the US, UAE and Europe.',
  body: `
<section class="hero"><div class="aura" style="width:620px;height:620px;right:-120px;top:10%;background:rgba(79,70,229,.09)"></div>
<div class="wrap hero-grid">
  <div>
    <div class="avail rv"><span class="pulse"></span>Available for AI Engineering roles · India · Remote · Global</div>
    <h1 class="h-xl split">I design, build and ship <span class="it">AI products</span> for clients on three continents, on my own.</h1>
    <p class="lede rv d2">AI Engineer and Global AI Consultant. From iOS and Android apps for Dubai's hypercar elite to 11-agent private AI systems for film directors, I take real client work <strong style="color:var(--ink)">from the first call to production</strong>, then train the client to own it.</p>
    <div class="btns rv d3"><a class="btn btn-gold" href="work.html">Explore the work <span class="arr">→</span></a><a class="btn btn-ghost" href="consulting.html">Consulting &amp; training</a></div>
    <div class="hero-meta rv d3"><div><b data-count="9">0</b><span>client products shipped</span></div><div><b>3</b><span>continents: US · UAE · EU</span></div><div><b data-count="40">0</b><b style="display:inline">+</b><span>global certifications</span></div></div>
  </div>
  <div class="globe-wrap rv d2"><div class="globe-fallback"></div><canvas id="globe"></canvas>
    <div class="pin" style="left:-4%;top:28%"><i></i><b>New York</b>&nbsp;· AI platforms</div>
    <div class="pin" style="right:-2%;top:44%;animation-delay:-2s"><i></i><b>Dubai</b>&nbsp;· apps + consulting</div>
    <div class="pin" style="left:18%;top:6%;animation-delay:-4s"><i></i><b>Europe</b>&nbsp;· private AI systems</div>
    <div class="pin" style="left:34%;bottom:6%;animation-delay:-3s"><i></i><b>India</b>&nbsp;· national-scale portal</div>
  </div>
</div></section>

<div class="marquee"><div class="track">${Array(2).fill(['Sole engineer, end to end', 'iOS · Android · Web', '11-agent AI systems', 'Voice AI agents', 'RAG under 500 ms', 'Custom automations', 'AI training for leaders', 'US · Dubai · Europe · India'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

<section class="sec"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">The scoreboard</span><h2 class="h-l split">Results, not responsibilities.</h2></div><p class="lede rv">Every number below comes from a production system I built and shipped.</p></div>
  <div class="score rv">
    <div><b><span data-count="5000">0</span><sup>+</sup></b><p>users on launch day for a CII national event, with zero corrupted records</p></div>
    <div><b>&lt;<span data-count="500">0</span><sup>ms</sup></b><p>retrieval latency on production RAG systems</p></div>
    <div><b><span data-count="80">0</span><sup>%</sup></b><p>lighter media payload for a live hypercar app across three continents</p></div>
    <div><b><span data-count="40">0</span><sup>+ hrs</sup></b><p>QA time saved per release by a self-healing test tool I created</p></div>
  </div>
</div></section>

<section class="sec" style="padding-top:40px"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">Flagship work</span><h2 class="h-l split">Real clients. Real stakes. <span class="it">Shipped.</span></h2></div><a class="btn btn-ghost rv" href="work.html">All 9 case studies <span class="arr">→</span></a></div>
  ${flagship.map((s, i) => { const p = bySlug[s]; return `<div class="show">
    <div class="rv"><div class="idx">0${i + 1} / ${p.client.toUpperCase()} · ${p.region.toUpperCase()}</div><h3>${p.title}</h3><p>${p.oneLine}</p>
      <div class="mini-kpis">${p.kpis.map(k => `<div><b>${k[0]}</b><span>${k[1]}</span></div>`).join('')}</div>
      ${tags(p.chips, statusTag(p))}
      <div class="btns"><a class="btn btn-gold" href="work/${p.slug}.html">Case study <span class="arr">→</span></a>${p.live ? `<a class="btn btn-ghost" href="${p.live}" target="_blank" rel="noopener">${p.liveLabel} ↗</a>` : ''}</div></div>
    <div class="show-vis rv d2"><div class="stage">${fit(mockups[s]())}</div></div></div>`; }).join('')}
  <div class="cards" style="margin-top:60px">${projects.filter(p => !flagship.includes(p.slug)).slice(0, 3).map(p => pcard(p)).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">What I deliver</span><h2 class="h-l split">Four disciplines. One accountable person.</h2></div></div>
  <div class="services rv">
    <div class="svc"><span class="n">01</span><h3>AI agents &amp; multi-agent systems</h3><p>Orchestrators, intent routers and specialist agents with governance built in: access scopes, human checkpoints and local-first options.</p><ul><li>LangGraph</li><li>CrewAI</li><li>n8n</li><li>Ollama</li><li>Vapi</li></ul></div>
    <div class="svc"><span class="n">02</span><h3>Mobile &amp; web products</h3><p>Full iOS, Android and web platforms, from database security to App Store delivery, built by one engineer without compromise.</p><ul><li>React Native</li><li>Next.js</li><li>Supabase</li><li>TypeScript</li></ul></div>
    <div class="svc"><span class="n">03</span><h3>RAG &amp; LLM engineering</h3><p>Retrieval that answers in under 500 ms, multi-model routing and grounded answers on your own data.</p><ul><li>pgvector</li><li>Qdrant</li><li>Redis</li><li>GPT-4 · Claude · Gemini</li></ul></div>
    <div class="svc"><span class="n">04</span><h3>Custom automation &amp; AI enablement</h3><p>Automations tailored to how a business really runs, and training that leaves teams able to run and extend them.</p><ul><li>n8n</li><li>Make</li><li>Zapier</li><li>Workshops</li></ul></div>
  </div>
</div></section>

<section class="sec" style="padding-top:40px"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">How I work</span><h2 class="h-l split">Scratch to production. <span class="it">Alone.</span></h2></div></div>
  <div class="process rv">
    <div class="step"><div class="dot">01</div><h4>Discover</h4><p>Client calls, process mapping and the real problem behind the request.</p></div>
    <div class="step"><div class="dot">02</div><h4>Architect</h4><p>System design, data model, security and the cost/latency trade-offs.</p></div>
    <div class="step"><div class="dot">03</div><h4>Build</h4><p>Frontend, backend, AI and automations in one pair of hands.</p></div>
    <div class="step"><div class="dot">04</div><h4>Ship</h4><p>Deploy, monitor, harden and deliver to the live domain or app store.</p></div>
    <div class="step"><div class="dot">05</div><h4>Hand over</h4><p>Training and documentation until the client runs it themselves.</p></div>
  </div>
  <div class="solo-note rv"><span style="font-size:24px">✦</span><span>No agency, no team behind the curtain. <b>Every project on this site was delivered by me, solo</b>, for clients in the US, UAE, Europe and India.</span></div>
</div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="feature rv">
  <div class="l"><span class="eyebrow">Global AI Consultant</span>
    <p class="quote">At 21, I was teaching <span class="it">film directors and operations leaders</span> how to run their own AI agents.</p>
    <p class="lede">I consult and train leaders across Dubai and Europe on AI, automation and agent systems, and I measure success by how little they need me afterwards.</p>
    <div class="btns" style="margin-top:30px"><a class="btn btn-gold" href="consulting.html">See consulting work <span class="arr">→</span></a></div></div>
  <div class="r">
    <div class="who"><span class="ic">🎬</span><div><b>Film directors</b><span>Private 11-agent AI system, plus hands-on training</span></div></div>
    <div class="who"><span class="ic">🏢</span><div><b>Operations managers · Dubai</b><span>AI, automation and agent workflows</span></div></div>
    <div class="who"><span class="ic">🤝</span><div><b>Welfare group HR team · Dubai</b><span>AI blueprints and team enablement</span></div></div>
    <div class="who"><span class="ic">🚀</span><div><b>Founders · US</b><span>AI coaching and sales automation platforms</span></div></div>
  </div></div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">Credentials</span><h2 class="h-l split">Trained by the institutions that define the field.</h2></div><a class="btn btn-ghost rv" href="credentials.html">View all certificates <span class="arr">→</span></a></div>
  <div class="issuers rv">${[['Stanford', 'Online'], ['Oracle', 'OCI GenAI Pro'], ['Google', 'Cloud · AI'], ['Microsoft', 'Azure · AI'], ['IBM', 'ML Honors'], ['AWS', 'ML · Cloud'], ['Imperial', 'College London'], ['McKinsey', 'Forward'], ['BCG', 'Data Science'], ['MongoDB', 'Vector Search'], ['Cisco', 'Python'], ['ISRO', 'Certified']].map(([a, b]) => `<div>${logoFor(a)}${a}<small>${b}</small></div>`).join('')}</div>
</div></section>`
});

// ================= WORK =================
const work = () => layout({
  title: 'Work · Stuti Gohil', active: 'work', desc: 'Nine real projects delivered solo, from AI agents and RAG to iOS/Android apps and automations.',
  body: `<section class="phero"><div class="aura" style="width:600px;height:500px;left:-100px;top:0;background:rgba(157,140,255,.08)"></div><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Work</div><span class="eyebrow">Case studies</span>
  <h1 class="h-xl split" style="margin-top:20px">Nine products. <span class="it">One builder.</span></h1>
  <p class="lede rv">Each one is a real client engagement I took from a blank page to production, across the US, Dubai, Europe and India.</p></div></section>
  <section style="padding-bottom:40px"><div class="wrap">
    <div class="filterbar rv" data-filter-group=".pcard"><button class="on" data-f="all">All work</button><button data-f="agents">AI agents</button><button data-f="rag">RAG &amp; LLM</button><button data-f="product">Apps &amp; platforms</button><button data-f="auto">Automation</button><button data-f="consult">Consulting</button></div>
    <div class="cards two">${projects.map(p => pcard(p)).join('')}</div></div></section>`
});

// ================= CASE STUDY =================
const caseStudy = (p, i) => {
  const next = projects[(i + 1) % projects.length], prev = projects[(i - 1 + projects.length) % projects.length];
  const archCols = p.arch.length;
  return layout({
    title: `${p.title} · Case study · Stuti Gohil`, active: 'work', depth: 1, desc: p.oneLine,
    body: `<section class="cs-hero"><div class="aura" style="width:700px;height:600px;right:-200px;top:0;background:rgba(79,70,229,.08)"></div><div class="wrap">
  <div class="crumbs"><a href="../index.html">Home</a> / <a href="../work.html">Work</a> / ${p.title}</div>
  <div class="cs-top"><div><span class="eyebrow">${p.client} · ${p.region} · ${p.year}</span><h1 class="split">${p.title}</h1><p class="lede rv">${p.oneLine}</p></div>
  <div class="btns rv">${p.live ? `<a class="btn btn-gold" href="${p.live}" target="_blank" rel="noopener">Visit ${p.liveLabel} ↗</a>` : ''}</div></div>
  <div class="facts rv"><div><small>Client</small><b>${p.client}</b></div><div><small>Region</small><b>${p.region}</b></div><div><small>My role</small><b>${p.role}</b></div><div><small>Platform</small><b>${p.platform}</b></div><div><small>Status</small><b>${p.status}</b></div></div>
  <div class="stage cs-stage rv">${fit(mockups[p.slug]())}</div>
  <div class="kband rv">${p.kpis.map(k => `<div><b>${k[0]}</b><span>${k[1]}</span></div>`).join('')}</div>
</div></section>
<nav class="subnav"><div class="wrap">${[['brief', 'Brief'], ['owned', 'My role'], ['product', 'Product'], ['architecture', 'Architecture'], ['decisions', 'Decisions'], ['outcomes', 'Outcomes'], ['delivery', 'Delivery']].map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}<span class="sn-title">${p.title}</span></div></nav>

<section class="cs-sec" id="brief"><div class="wrap cs-2"><h2 class="h-m rv">The brief</h2><div class="prose rv">${p.brief.map(b => `<p>${b}</p>`).join('')}
  <div class="challenge">${p.challenges.map((c, k) => `<div><i>CHALLENGE 0${k + 1}</i><p>${c}</p></div>`).join('')}</div></div></div></section>

<section class="cs-sec" id="owned"><div class="wrap cs-2"><div><span class="eyebrow">My role</span><h2 class="h-m rv" style="margin-top:18px">What I owned, personally</h2><p class="lede rv" style="margin-top:18px">${p.role}. No team behind me: every item below was mine.</p></div>
  <ol class="owned">${owned[p.slug].map((o, k) => `<li class="rv"><span>${String(k + 1).padStart(2, '0')}</span>${o}<em>✓</em></li>`).join('')}</ol></div></section>

<section class="cs-sec" id="product"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">What I built</span><h2 class="h-l split">The product</h2></div></div>
  <div class="features">${p.features.map(([ic, h, t], k) => `<div class="feat rv d${k % 3}"><div class="ic">${ic}</div><h4>${h}</h4><p>${t}</p></div>`).join('')}</div></div></section>

<section class="cs-sec" id="architecture"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Architecture</span><h2 class="h-l split">How it works</h2></div></div>
  <div class="arch rv"><div class="arch-row" style="grid-template-columns:${Array(archCols).fill('1fr').join(' 40px ')}">
  ${p.arch.map(([label, nodes], k) => `${k ? '<div class="arch-arrow">→</div>' : ''}<div class="arch-col"><small>${label}</small>${nodes.map(([n, s, c]) => `<div class="arch-node ${c || ''}">${n}<span>${s}</span></div>`).join('')}</div>`).join('')}
  </div><p class="arch-caption">${p.archCaption}</p></div></div></section>

<section class="cs-sec" id="decisions"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Engineering decisions</span><h2 class="h-l split">Hard problems, solved</h2></div></div>
  <div class="decisions">${p.decisions.map(([h, t], k) => `<div class="decision rv"><span class="n">0${k + 1}</span><h4>${h}</h4><p>${t}</p></div>`).join('')}</div></div></section>

<section class="cs-sec" id="outcomes"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Outcomes</span><h2 class="h-l split">What it delivered</h2></div></div>
  <div class="outcomes">${p.outcomes.map(([b, t], k) => `<div class="oc rv d${k}"><b>${b}</b><p>${t}</p></div>`).join('')}</div>
  <div style="margin-top:60px" class="rv"><span class="eyebrow">Stack</span><div class="stackrow" style="margin-top:20px">${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div></div></div></section>

<section class="cs-sec" id="delivery"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Delivery</span><h2 class="h-l split">Every phase. One person.</h2></div></div>
  <div class="phases rv">${[['Discover', 'Requirements and process mapping with the client'], ['Architect', 'System, data and security design'], ['Build', 'Frontend, backend, AI and automation'], ['Ship', 'Deployment, hardening and delivery'], ['Hand over', 'Training, documentation and support']].map(([h, t], k) => `<div class="phase"><small>PHASE 0${k + 1}</small><span class="me">ME</span><h5>${h}</h5><p>${t}</p></div>`).join('')}</div></div></section>

<div class="pn"><a href="${prev.slug}.html"><small>← Previous</small><b>${prev.title}</b></a><a href="../work.html" class="all"><small>Index</small><b>All work</b></a><a href="${next.slug}.html" class="r"><small>Next →</small><b>${next.title}</b></a></div>
<a class="next" href="${next.slug}.html"><div class="wrap"><small>Next case study</small><h3>${next.title} →</h3></div></a>`
  });
};

// ================= CONSULTING =================
const consulting = () => layout({
  title: 'Global AI Consulting & Training · Stuti Gohil', active: 'consulting', desc: 'AI, automation and agent consulting and training for film directors, operations leaders and teams in Dubai and Europe.',
  body: `<section class="phero"><div class="aura" style="width:700px;height:600px;right:-200px;top:0;background:rgba(79,70,229,.1)"></div><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Consulting</div><span class="eyebrow">Global AI Consultant</span>
  <h1 class="h-xl split" style="margin-top:20px">I don't just build AI. <span class="it">I teach leaders to own it.</span></h1>
  <p class="lede rv">At 21–22 I was advising and training film directors and operations managers in Dubai and Europe on AI, custom automations and AI agents: designing their systems, building them, and making sure they could run them without me.</p>
  <div class="btns rv" style="margin-top:36px"><a class="btn btn-gold" href="mailto:${EMAIL}?subject=AI%20consulting%20enquiry">Start an engagement <span class="arr">→</span></a></div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Engagements</span><h2 class="h-l split">Who I've advised</h2></div></div>
  <div class="engage">
    <div class="eng rv"><span class="where">Film · Europe &amp; Dubai</span><h3>Film director: a private AI operating system</h3><p>Designed and built an 11-agent local-first system with a master intent router and per-agent access control, then trained the director to operate and extend it.</p><div class="result">→ Client runs it independently</div></div>
    <div class="eng rv d1"><span class="where">Operations · Dubai</span><h3>Operations managers: AI and automation</h3><p>Advised operations leaders on where AI, custom automations and agents fit their workflows, then taught their teams the tools to act on it.</p><div class="result">→ Teams automating their own work</div></div>
    <div class="eng rv d2"><span class="where">HR · Dubai</span><h3>Welfare group: AI HR blueprint</h3><p>Automation blueprints for screening, scheduling, offers and onboarding with human approval built in, plus coaching for the internal team.</p><div class="result">→ System owned in-house</div></div>
  </div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">What I teach</span><h2 class="h-l split">The curriculum</h2></div><p class="lede rv">Tailored to each client and taught hands-on, using their own data and workflows.</p></div>
  <div class="curriculum rv">
    <div class="mod"><small>MODULE 01</small><h4>AI for decision-makers</h4><p>What LLMs can and can't do, and how to spot real opportunities.</p></div>
    <div class="mod"><small>MODULE 02</small><h4>Prompting &amp; AI tools</h4><p>Getting reliable, professional output from ChatGPT, Claude and Gemini.</p></div>
    <div class="mod"><small>MODULE 03</small><h4>Custom automations</h4><p>Building workflows in n8n, Make and Zapier that remove repetitive work.</p></div>
    <div class="mod"><small>MODULE 04</small><h4>AI agents</h4><p>How agents, routers and tools work together, and how to supervise them.</p></div>
    <div class="mod"><small>MODULE 05</small><h4>Governance &amp; privacy</h4><p>Access control, human-in-the-loop design and local-first options for confidential data.</p></div>
    <div class="mod"><small>MODULE 06</small><h4>Ownership &amp; handover</h4><p>Running, monitoring and extending the system without outside help.</p></div>
  </div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Engagement model</span><h2 class="h-l split">From audit to independence</h2></div></div>
  <div class="process rv">
    <div class="step"><div class="dot">01</div><h4>Audit</h4><p>Map processes and find where AI returns the most.</p></div>
    <div class="step"><div class="dot">02</div><h4>Blueprint</h4><p>A clear written plan leadership can approve.</p></div>
    <div class="step"><div class="dot">03</div><h4>Build</h4><p>Systems built with the team, not handed down to them.</p></div>
    <div class="step"><div class="dot">04</div><h4>Train</h4><p>Hands-on sessions on the client's own workflows.</p></div>
    <div class="step"><div class="dot">05</div><h4>Independence</h4><p>The client owns it, and success means not needing me.</p></div>
  </div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Related work</span><h2 class="h-l split">Consulting case studies</h2></div></div>
  <div class="cards two">${projects.filter(p => p.tags.includes('consult')).map(p => pcard(p)).join('')}</div></div></section>`
});

// ================= CREDENTIALS =================
const credentials = () => {
  const issuers = ['all', 'ai', 'cloud', 'data', 'business'];
  const labels = { all: 'All', ai: 'AI & ML', cloud: 'Cloud', data: 'Data', business: 'Business & leadership' };
  return layout({
    title: 'Credentials · Stuti Gohil', active: 'credentials', desc: 'Certifications from Stanford, Oracle, Google, Microsoft, IBM, AWS, Imperial College London and more.',
    body: `<section class="phero"><div class="aura" style="width:600px;height:500px;left:30%;top:0;background:rgba(110,240,194,.06)"></div><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Credentials</div><span class="eyebrow">Credentials</span>
  <h1 class="h-xl split" style="margin-top:20px">Certified across the <span class="it">AI stack.</span></h1>
  <p class="lede rv">40+ certifications from Stanford, Oracle, Google, Microsoft, IBM, AWS, Imperial College London and more, all put to work in production systems.</p></div></section>

<section style="padding-bottom:100px"><div class="wrap">
  <div class="issuer-wall rv">${['Stanford Online', 'Oracle', 'Google', 'Google Cloud', 'Microsoft', 'IBM', 'AWS', 'Imperial College London', 'DeepLearning.AI', 'MongoDB', 'Cisco', 'LinkedIn', 'McKinsey', 'BCG', 'WHO', 'ISRO', 'Goldman Sachs', 'Walmart', 'PepsiCo', 'HP', 'freeCodeCamp', 'Udemy', 'Coursera', 'PMI'].map(i => `<div>${logoFor(i)}<span>${i}</span></div>`).join('')}</div>
  <div class="cred-feature">
    <div class="cf rv">${logoFor('Oracle')}<small>Oracle · Professional</small><h3>OCI Generative AI Professional</h3><p>Issued Oct 2025. Professional-level certification in LLMs, RAG and GenAI on OCI.</p></div>
    <div class="cf rv d1">${logoFor('Oracle')}<small>Oracle · Professional</small><h3>OCI Data Science Professional</h3><p>Issued Oct 2025. Professional-level data science and ML on OCI.</p></div>
    <div class="cf rv d2">${logoFor('Stanford')}<small>Stanford Online</small><h3>Advanced Learning Algorithms</h3><p>Issued Mar 2025. Neural networks, decision trees and ML best practice.</p></div>
  </div>

  <div class="edu-card rv" style="margin-bottom:100px"><div class="l"><span class="eyebrow">Education</span><h2 class="h-m" style="margin:18px 0 10px">B.Tech, Information &amp; Communication Technology</h2><p class="lede">Pandit Deendayal Energy University, Gandhinagar · Nov 2022 – May 2026</p></div>
  <div class="r"><div class="cpi">8.89<small>CPI / 10</small></div></div></div>

  <div class="sec-head"><div><span class="eyebrow">Recognition</span><h2 class="h-l split">Beyond the certificates</h2></div></div>
  <div class="awards" style="margin-bottom:110px">
    <div class="award rv"><b>Top 1%</b><p>PepsiCo Sales Star, out of 35,000+ applicants</p></div>
    <div class="award rv d1"><b>McKinsey</b><p>Forward Program</p></div>
    <div class="award rv d2"><b>200K+</b><p>LinkedIn impressions on AI writing</p></div>
    <div class="award rv d3"><b>ISRO</b><p>Certified by the Indian Space Research Organisation</p></div>
  </div>

  <div class="sec-head"><div><span class="eyebrow">Certificate wall</span><h2 class="h-l split">Click any certificate to view it</h2></div></div>
  <div class="filterbar rv" data-filter-group=".cert">${issuers.map((f, k) => `<button class="${k ? '' : 'on'}" data-f="${f}">${labels[f]}</button>`).join('')}</div>
  <div class="cert-grid">${certs.filter(c => c[2]).map(([iss, t, img, tg]) => `<div class="cert rv" data-tags="${tg}"><div class="img"><img loading="lazy" src="assets/certs/${img}.jpg" alt="${iss}: ${t} certificate"></div><div class="cap">${logoFor(iss)}<div><small>${iss}</small><b>${t}</b></div></div></div>`).join('')}</div>

  <div class="sec-head" style="margin-top:110px"><div><span class="eyebrow">Also certified</span><h2 class="h-m">More credentials</h2></div></div>
  <ul class="cert-list rv">${[...certs.filter(c => !c[2]), ...moreCerts].map(([iss, t]) => `<li>${logoFor(iss)}<div>${t}<span>${iss}</span></div></li>`).join('')}</ul>
</div></section>
<div class="lightbox"><div><img alt=""><p></p></div></div>`
  });
};

// ================= WRITE =================
const out = (file, html) => { const p = join(ROOT, file); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, html); };
out('index.html', home());
out('work.html', work());
out('consulting.html', consulting());
out('credentials.html', credentials());
projects.forEach((p, i) => out(`work/${p.slug}.html`, caseStudy(p, i)));
console.log(`Built ${4 + projects.length} pages`);
