// Static site generator: node _build/build.mjs  ->  writes HTML pages into the Portfolio root.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects, flagship, certs, moreCerts, owned, certifications } from './data.mjs';
import { mockups } from './mockups.mjs';
import { ic } from './icons.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
const V = Date.now().toString(36);
const RESUME_PDF = 'assets/Stuti_Gohil_AI_Engineer.pdf';
const HIRE = 'Open to full-time AI engineering and full-stack roles. Based in Gandhinagar, India, open to relocate to Bangalore or Mumbai, or to work remotely.';
const NUM = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
// Public site URL: change this one line after connecting a custom domain
const SITE = 'https://portfolio-self-beta-46.vercel.app';
const CAL = 'https://cal.com/stuti-sg19';
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
<link rel="canonical" href="{{CANON}}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Stuti Gohil"><meta property="og:url" content="{{CANON}}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}/assets/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Stuti Gohil, AI Engineer: I build AI systems that take manual work off your team's plate">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${SITE}/assets/og.png">
<meta name="theme-color" content="#F7F9FC">${active === 'home' ? `
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Stuti Gohil', url: SITE, image: `${SITE}/assets/og.png`, jobTitle: 'AI Engineer', email: `mailto:${EMAIL}`, knowsAbout: ['AI agents', 'Voice AI', 'Retrieval-augmented generation', 'Workflow automation', 'React Native', 'Full-stack development'], sameAs: ['https://linkedin.com/in/stuti-gohil', 'https://github.com/Stuti-1908'] })}</script>` : ''}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%234F46E5'/%3E%3Ctext x='50%25' y='58%25' font-family='Arial,Helvetica,sans-serif' font-weight='700' font-size='36' text-anchor='middle' fill='%23fff'%3ES%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}</script>
<link rel="stylesheet" href="${r}assets/css/site.css?v=${V}">
</head><body>
<a class="skip" href="#main">Skip to content</a>
<button class="ask-fab" type="button" aria-haspopup="dialog" aria-controls="ask">${ic('spark')}<span>Ask my portfolio</span></button>
<section class="ask" id="ask" role="dialog" aria-modal="false" aria-labelledby="ask-title" hidden>
  <header class="ask-head"><span class="ask-av">${ic('spark')}</span><div><b id="ask-title">Ask my portfolio</b><small>AI assistant · answers from Stuti's case studies</small></div><button class="ask-x" type="button" aria-label="Close chat">${ic('x')}</button></header>
  <div class="ask-log" aria-live="polite">
    <div class="ask-msg bot">Hi! Ask me anything about Stuti's work: projects, skills, experience, or her availability for full-time roles.</div>
    <div class="ask-chips">${['Has she built voice AI agents?', 'What did she build for YourInboxHero?', 'What did she do at Digital Dada?', 'Is she open to full-time roles?'].map(q => `<button type="button">${q}</button>`).join('')}</div>
  </div>
  <form class="ask-form"><label class="sr" for="ask-in">Your question</label><input id="ask-in" name="q" autocomplete="off" maxlength="600" placeholder="Ask about her work…"><button type="submit" aria-label="Send">${ic('arrowUp')}</button></form>
  <p class="ask-note">AI answers can be imperfect. <a href="${r}contact.html">Contact Stuti</a> to talk to her directly.</p>
</section>
<div class="progress"></div>
<div class="qv" role="dialog" aria-modal="true" aria-label="Project preview"><div class="qv-card"><button class="qv-x" aria-label="Close">${ic('x')}</button><div class="qv-vis"></div><div class="qv-body"></div></div></div>
<header class="nav"><div class="wrap">
  <a class="brand" href="${r}index.html"><span class="mark">S</span><span>Stuti Gohil<small>AI Engineer</small></span></a>
  <div class="nav-tools"><button class="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode"><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button><button class="burger" aria-label="Menu">${ic('menu')}</button></div>
  <nav class="nav-links">${link('index.html', 'Home', 'home')}${link('work.html', 'Work', 'work')}${link('credentials.html', 'Credentials', 'credentials')}${link('resume.html', 'Resume', 'resume')}<a class="cta-pill" href="${r}contact.html">Hire me</a></nav>
</div></header>
<main id="main">${body.replaceAll("{{R}}", r)}</main>
${ctaBlock(r)}
<footer><div class="wrap">
  <div class="foot-cols">
    <div class="foot-brand"><a class="brand" href="${r}index.html"><span class="mark">S</span><span>Stuti Gohil<small>AI Engineer</small></span></a><p>AI Engineer open to full-time AI engineering and full-stack roles. Based in Gandhinagar, India, open to relocate to Bangalore or Mumbai, or to work remotely.</p>
      <div class="soc"><a href="https://linkedin.com/in/stuti-gohil" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin', 'currentColor')}</a><a href="https://github.com/Stuti-1908" target="_blank" rel="noopener" aria-label="GitHub">${icon('github', 'currentColor')}</a><a href="mailto:${EMAIL}" aria-label="Email">${ic('mail')}</a><a href="${CAL}" target="_blank" rel="noopener" aria-label="Book a call">${ic('calendar')}</a></div></div>
    <nav aria-label="Site"><b>Explore</b><a href="${r}work.html">Work</a><a href="${r}consulting.html">Consulting</a><a href="${r}credentials.html">Credentials</a><a href="${r}resume.html">Resume</a><a href="${r}contact.html">Contact</a></nav>
    <nav aria-label="Live products"><b>Live products</b><a href="https://www.yourinboxhero.com/" target="_blank" rel="noopener">yourinboxhero.com ↗</a><a href="https://thesopbot.com" target="_blank" rel="noopener">thesopbot.com ↗</a><a href="https://exoticlobby.com" target="_blank" rel="noopener">exoticlobby.com ↗</a></nav>
    <div class="foot-book"><b>Open to full-time roles</b><p>AI engineering and full-stack. Remote, or relocating to Bangalore or Mumbai.</p><a class="btn btn-gold" href="${r}contact.html">Contact me <span class="arr">→</span></a></div>
  </div>
  <div class="foot-bottom"><span>© 2026 Stuti Gohil. AI Engineer, Gandhinagar, India.</span><a href="#main">Back to top ↑</a></div>
</div></footer>
<script src="${r}assets/js/site.js?v=${V}" type="module"></script>
<script defer src="/_vercel/insights/script.js"></script>
</body></html>`;
};

const ctaBlock = (r = '') => `<section class="cta-block">
  <div class="aura" style="width:700px;height:500px;left:50%;top:40%;translate:-50% -50%;background:rgba(79,70,229,.10)"></div>
  <div class="wrap"><span class="eyebrow">Open to full-time AI engineering and full-stack roles</span>
  <h2 class="h-xl split">Looking for an AI engineer who <span class="it">ships to production?</span></h2>
  <p class="hire-line">Based in Gandhinagar, India. Open to relocate to Bangalore or Mumbai, or to work remotely.</p>
  <div class="btns"><a class="btn btn-gold" href="${r}resume.html">View resume <span class="arr">→</span></a><a class="btn btn-ghost" href="${r}contact.html">Contact me</a><a class="btn btn-ghost" href="https://linkedin.com/in/stuti-gohil" target="_blank" rel="noopener">LinkedIn ↗</a></div></div></section>`;

const tags = (arr, first) => `<div class="tags">${first || ''}${arr.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
const statusTag = p => `<span class="tag ${p.status === 'Live' ? 'live' : 'gold'}">${p.status === 'Live' ? '● ' : ''}${p.status}</span>`;
const fit = (html, cls = '') => `<div class="fit ${cls}">${html}</div>`;

const pcard = (p, depth = 0) => `<a class="pcard rv" href="${depth ? '' : 'work/'}${p.slug}.html" data-tags="${p.tags}">
  <div class="thumb">${fit(mockups[p.slug](), 'crop')}</div><button type="button" class="qv-btn">Quick view</button>
  <div class="body"><div class="meta">${p.client} · ${p.region}</div><h3>${p.title}</h3><p>${p.card}</p>${tags(p.chips.slice(0, 3), statusTag(p))}<span class="go">Read the case study <span class="arr">→</span></span></div></a>`;

// ================= HOME =================
const home = () => layout({
  title: 'Stuti Gohil · AI Engineer', active: 'home',
  desc: 'AI Engineer building LLM agents, RAG and workflow automation, with full-stack products in Python and TypeScript. Open to full-time roles. Based in Gandhinagar, India.',
  body: `
<section class="hero"><div class="aura" style="width:620px;height:620px;right:-120px;top:10%;background:rgba(79,70,229,.09)"></div>
<div class="wrap hero-grid">
  <div>
    <div class="avail rv"><span class="pulse"></span>Open to full-time AI engineering and full-stack roles</div>
    <h1 class="h-xl split">I build AI systems that take <span class="it">manual work</span> off your team's plate.</h1>
    <p class="lede rv d2">LLM agents, RAG and workflow automation, plus full-stack AI products in Python and TypeScript. I own the whole journey, <strong style="color:var(--ink)">from the first requirement to production</strong>, and plug straight into your team.</p>
    <p class="hire-line rv d2"><strong>${HIRE}</strong></p>
    <div class="btns rv d3"><a class="btn btn-gold" href="resume.html">View resume <span class="arr">→</span></a><a class="btn btn-ghost" href="contact.html">Contact me</a><a class="btn btn-ghost" href="work.html">View my work</a></div>
    <form class="hero-ask rv d3" data-ask><span class="ha-ic">${ic('spark')}</span><label class="sr" for="hero-ask-in">Ask my portfolio</label><input id="hero-ask-in" name="q" autocomplete="off" maxlength="600" placeholder="Ask my portfolio: “Has she built voice agents?”"><button type="submit" class="btn btn-gold">Ask</button></form>
    <div class="hero-meta rv d3"><div><b data-count="${projects.length}">${projects.length}</b><span>projects delivered</span></div><div><b>3</b><span>continents: US · UAE · EU</span></div><div><b><span data-count="40">40</span>+</b><span>certificates and courses</span></div></div>
  </div>
  <div class="showcase rv d2" aria-label="Selected live products"><div class="sc-stack"><a class="sc-card" href="work/yourinboxhero.html" data-pos="0"><div class="sc-bar"><i></i><i></i><i></i><span>app.yourinboxhero.com / invoices</span></div><div class="sc-img"><img src="assets/dashboard-invoices.png" width="1535" height="674" alt="YourInboxHero dashboard listing overdue and upcoming invoices" decoding="async" fetchpriority="high"></div><div class="sc-cap"><b>YourInboxHero</b><span>Payment and document chasing SaaS</span><em>Case study →</em></div></a><a class="sc-card" href="work/exotic-lobby.html" data-pos="1"><div class="sc-bar"><i></i><i></i><i></i><span>Exotic Lobby · iOS & Android</span></div><div class="sc-img"><img src="assets/exotic-lobby.jpg" width="660" height="812" alt="Exotic Lobby mobile app with communities, events and garage" decoding="async" loading="lazy"></div><div class="sc-cap"><b>Exotic Lobby</b><span>Private hypercar network, iOS, Android, web</span><em>Case study →</em></div></a><a class="sc-card" href="work/a-square-merch.html" data-pos="2"><div class="sc-bar"><i></i><i></i><i></i><span>a-square-psi.vercel.app / catalogue</span></div><div class="sc-img"><img src="assets/a-square-catalogue.jpg" width="1917" height="866" alt="A Square Merch 3D coverflow catalogue" decoding="async" loading="lazy"></div><div class="sc-cap"><b>A Square Merch</b><span>Merch storefront with 3D catalogue and CMS</span><em>Case study →</em></div></a></div><div class="sc-dots"><button type="button" aria-label="Show YourInboxHero" class=on></button><button type="button" aria-label="Show Exotic Lobby"></button><button type="button" aria-label="Show A Square Merch"></button></div></div>
</div></section>

<div class="marquee"><div class="track">${Array(2).fill(['Sole engineer, end to end', 'iOS · Android · Web', '11-agent AI systems', 'Voice AI agents', 'Two-tier RAG', 'Custom automations', 'LLM agents', 'US · Dubai · Europe · India'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

<section class="sec"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">The scoreboard</span><h2 class="h-l split">Results, not responsibilities.</h2></div><p class="lede rv">Every number below comes from a live system I built, measured in what it changed for the people using it.</p></div>
  <div class="score rv">
    <div><b><span data-count="5000">5000</span><sup>+</sup></b><p>people served on launch day by a national CII event portal, with zero corrupted records</p></div>
    <div><b>&lt;<span data-count="500">500</span><sup>ms</sup></b><p>for two-tier RAG answers on a national event portal, using PostgreSQL tsvector and pgvector with a Redis cache</p></div>
    <div><b><span data-count="80">80</span><sup>%</sup></b><p>less data for hypercar-club members to load, fixing the app for users across Europe, the Middle East and the US</p></div>
    <div><b><span data-count="40">40</span><sup>+ hrs</sup></b><p>QA hours handed back to the team every release by a self-healing test tool</p></div>
  </div>
</div></section>

<section class="sec band band-dark"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">Flagship work</span><h2 class="h-l split">Real clients. Real stakes. <span class="it">Shipped.</span></h2></div><a class="btn btn-ghost rv" href="work.html">All ${projects.length} case studies <span class="arr">→</span></a></div>
  ${flagship.map((s, i) => { const p = bySlug[s]; return `<div class="show">
    <div class="rv"><div class="idx">0${i + 1} / ${p.client.toUpperCase()} · ${p.region.toUpperCase()}</div><h3>${p.title}</h3><p>${p.oneLine}</p>
      <div class="mini-kpis">${p.kpis.map(k => `<div><b>${k[0]}</b><span>${k[1]}</span></div>`).join('')}</div>
      ${tags(p.chips, statusTag(p))}
      <div class="btns"><a class="btn btn-gold" href="work/${p.slug}.html">Case study <span class="arr">→</span></a>${p.live ? `<a class="btn btn-ghost" href="${p.live}" target="_blank" rel="noopener">${p.liveLabel} ↗</a>` : ''}</div></div>
    <div class="show-vis rv d2"><div class="stage">${fit(mockups[s]())}</div></div></div>`; }).join('')}
  <div class="cards" style="margin-top:60px">${projects.filter(p => !flagship.includes(p.slug)).slice(0, 3).map(p => pcard(p)).join('')}</div>
</div></section>

<section class="sec band band-tint"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">What I work on</span><h2 class="h-l split">Four areas. One engineer.</h2></div></div>
  <div class="services rv">
    <div class="svc"><span class="n">01</span><h3>AI agents &amp; multi-agent systems</h3><p>Orchestrators, intent routers and specialist agents with governance built in: access scopes, human checkpoints and local-first options.</p><ul><li>LangGraph</li><li>CrewAI</li><li>n8n</li><li>Ollama</li><li>Vapi</li></ul></div>
    <div class="svc"><span class="n">02</span><h3>Mobile &amp; web products</h3><p>Full iOS, Android and web platforms, from database security to App Store delivery, built by one engineer without compromise.</p><ul><li>React Native</li><li>Next.js</li><li>Supabase</li><li>TypeScript</li></ul></div>
    <div class="svc"><span class="n">03</span><h3>RAG &amp; LLM engineering</h3><p>RAG retrieval, multi-model routing and grounded answers on your own data.</p><ul><li>pgvector</li><li>Qdrant</li><li>Redis</li><li>GPT-4 · Claude · Gemini</li></ul></div>
    <div class="svc"><span class="n">04</span><h3>Workflow automation</h3><p>Automations tailored to how a business really runs, built so teams can run and extend them.</p><ul><li>n8n</li><li>Make</li><li>Zapier</li><li>Twilio</li></ul></div>
  </div>
  <div class="solo-note rv"><span class="solo-ic">${ic('spark')}</span><span>One accountable owner across the whole lifecycle, from discovery to handover. <b>I have shipped solo, and I plug straight into existing teams</b>, remote or in person.</span></div>
</div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="feature rv">
  <div class="l"><span class="eyebrow">Consulting and training</span>
    <p class="quote">Earlier in 2026 I trained a <span class="it">film director and a welfare group's HR team</span> to run their own AI systems.</p>
    <p class="lede">From Mar 2026 to Aug 2026 I worked as a contract AI consultant and trainer for private clients in Europe and Dubai on AI, automation and agent systems, and I measured success by how little they needed me afterwards.</p>
    <div class="btns" style="margin-top:30px"><a class="btn btn-ghost" href="consulting.html">See past consulting work <span class="arr">→</span></a></div></div>
  <div class="r">
    <div class="who"><span class="ic">${ic('film')}</span><div><b>Film directors</b><span>Private 11-agent AI system, plus hands-on training</span></div></div>
    <div class="who"><span class="ic">${ic('building')}</span><div><b>Operations managers · Dubai</b><span>AI, automation and agent workflows</span></div></div>
    <div class="who"><span class="ic">${ic('users')}</span><div><b>Welfare group HR team · Dubai</b><span>AI blueprints and team enablement</span></div></div>
    <div class="who"><span class="ic">${ic('rocket')}</span><div><b>Founders · US</b><span>AI coaching and sales automation platforms</span></div></div>
  </div></div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap">
  <div class="sec-head"><div><span class="eyebrow">Credentials</span><h2 class="h-l split">Certifications, courses and programs.</h2></div><a class="btn btn-ghost rv" href="credentials.html">View all credentials <span class="arr">→</span></a></div>
  <h3 class="issuers-label rv">Certifications</h3>
  <div class="issuers issuers-2 rv">${[['Oracle', 'Cloud Infrastructure Generative AI Professional'], ['Oracle', 'Cloud Infrastructure Data Science Professional']].map(([a, b]) => `<div>${logoFor(a)}${a}<small>${b}</small></div>`).join('')}</div>
  <h3 class="issuers-label rv">Courses and programs</h3>
  <div class="issuers rv">${[['Stanford', 'Advanced Learning Algorithms'], ['Google', 'Gen AI · RAG'], ['Microsoft', 'Generative AI on Azure'], ['AWS', 'ML exam readiness · RAG'], ['DeepLearning.AI', 'LLMs']].map(([a, b]) => `<div>${logoFor(a)}${a}<small>${b}</small></div>`).join('')}</div>
</div></section>`
});

// ================= WORK =================
const work = () => layout({
  title: 'Work · Stuti Gohil', active: 'work', desc: `${NUM[projects.length]} case studies, from AI agents and RAG to iOS/Android apps and automations, each taken from a blank page to production.`,
  body: `<section class="phero"><div class="aura" style="width:600px;height:500px;left:-100px;top:0;background:rgba(157,140,255,.08)"></div><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Work</div><span class="eyebrow">Case studies</span>
  <h1 class="h-xl split" style="margin-top:20px">${NUM[projects.length]} case studies. <span class="it">One engineer.</span></h1>
  <p class="lede rv">Employer, client and self-initiated work, each taken from a blank page to production, across the US, Dubai, Europe and India.</p></div></section>
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
  <div class="cs-top"><div><span class="eyebrow">${p.client} · ${p.region} · ${p.period || p.year}</span><h1 class="split">${p.title}</h1><p class="lede rv">${p.oneLine}</p></div>
  <div class="btns rv">${p.live ? `<a class="btn btn-gold" href="${p.live}" target="_blank" rel="noopener">Visit ${p.liveLabel} ↗</a>` : ''}<a class="btn btn-ghost" href="../contact.html">Contact me</a></div></div>
  <div class="facts rv"><div><small>Client</small><b>${p.client}</b></div><div><small>Location</small><b>${p.region}</b></div><div><small>Period</small><b>${p.period || p.year}</b></div><div><small>My role</small><b>${p.role}</b></div><div><small>Platform</small><b>${p.platform}</b></div><div><small>Status</small><b>${p.status}</b></div></div>
  <div class="kband rv"><span class="kb-k">The result</span>${p.kpis.map(k => `<div><b>${k[0]}</b><span>${k[1]}</span></div>`).join('')}</div>
${p.testimonial ? `  <figure class="tq rv"><blockquote>“${p.testimonial.quote}”</blockquote><figcaption><b>${p.testimonial.name}</b>${p.testimonial.title}</figcaption></figure>\n` : ''}  <div class="stage cs-stage rv">${fit(mockups[p.slug]())}</div>
</div></section>
<nav class="subnav"><div class="wrap">${[['brief', 'Brief'], ['owned', 'My role'], ['product', 'Product'], ['architecture', 'Architecture'], ['decisions', 'Decisions'], ['outcomes', 'Outcomes'], ['delivery', 'Delivery']].map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}<span class="sn-title">${p.title}</span></div></nav>

<section class="cs-sec" id="brief"><div class="wrap cs-2"><h2 class="h-m rv">The brief</h2><div class="prose rv">${p.brief.map(b => `<p>${b}</p>`).join('')}
  <div class="challenge">${p.challenges.map((c, k) => `<div><i>CHALLENGE 0${k + 1}</i><p>${c}</p></div>`).join('')}</div></div></div></section>

<section class="cs-sec" id="owned"><div class="wrap cs-2"><div><span class="eyebrow">My role</span><h2 class="h-m rv" style="margin-top:18px">What I owned, personally</h2><p class="lede rv" style="margin-top:18px">${p.role}. Every item below was my own work.</p></div>
  <ol class="owned">${owned[p.slug].map((o, k) => `<li class="rv"><span>${String(k + 1).padStart(2, '0')}</span>${o}<em>${ic('check')}</em></li>`).join('')}</ol></div></section>

<section class="cs-sec" id="product"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">What I built</span><h2 class="h-l split">The product</h2></div></div>
  <div class="features">${p.features.map(([icn, h, t], k) => `<div class="feat rv d${k % 3}"><div class="ic">${ic(icn)}</div><h4>${h}</h4><p>${t}</p></div>`).join('')}</div></div></section>

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
  <div class="phases rv">${(p.slug === 'a-square-merch' ? [['Define', 'Brief, scope and design direction set by me'], ['Architect', 'System, data and security design'], ['Build', 'Frontend, backend, CMS and animation'], ['Ship', 'Deployment, hardening and delivery'], ['Document', 'README and environment template']] : [['Discover', 'Requirements and process mapping with the client'], ['Architect', 'System, data and security design'], ['Build', 'Frontend, backend, AI and automation'], ['Ship', 'Deployment, hardening and delivery'], ['Hand over', 'Training, documentation and support']]).map(([h, t], k) => `<div class="phase"><small>PHASE 0${k + 1}</small><span class="me">ME</span><h5>${h}</h5><p>${t}</p></div>`).join('')}</div></div></section>

<div class="pn"><a href="${prev.slug}.html"><small>← Previous</small><b>${prev.title}</b></a><a href="../work.html" class="all"><small>Index</small><b>All work</b></a><a href="${next.slug}.html" class="r"><small>Next →</small><b>${next.title}</b></a></div>
<a class="next" href="${next.slug}.html"><div class="wrap"><small>Next case study</small><h3>${next.title} →</h3></div></a>`
  });
};

// ================= CONSULTING =================
const consulting = () => layout({
  title: 'AI Consulting & Training · Stuti Gohil', active: 'consulting', desc: 'Past AI, automation and agent consulting and training work for private clients in Europe and Dubai, Mar 2026 to Aug 2026.',
  body: `<section class="phero"><div class="aura" style="width:700px;height:600px;right:-200px;top:0;background:rgba(79,70,229,.1)"></div><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Consulting</div><span class="eyebrow">Consulting and training</span>
  <h1 class="h-xl split" style="margin-top:20px">Past consulting and <span class="it">training work.</span></h1>
  <p class="lede rv">From Mar 2026 to Aug 2026 I worked as a contract AI consultant and trainer (AI Consultant and Trainer, Private Clients, Europe / Dubai, UAE, remote). I designed and built AI systems for a European film director and a Dubai welfare group, and trained their teams to run them without me.</p>
  <div class="btns rv" style="margin-top:36px"><a class="btn btn-gold" href="resume.html">View resume <span class="arr">→</span></a><a class="btn btn-ghost" href="contact.html">Contact me</a></div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">Past engagements</span><h2 class="h-l split">Who I worked with</h2></div></div>
  <div class="engage">
    <div class="eng rv"><span class="where">Film · Europe &amp; Dubai</span><h3>Film director: a private AI operating system</h3><p>Designed and built an 11-agent local-first system with a master intent router and per-agent access control, then trained the director to operate and extend it.</p><div class="result">Client runs it independently</div></div>
    <div class="eng rv d1"><span class="where">Operations · Dubai</span><h3>Operations managers: AI and automation</h3><p>Advised operations leaders on where AI, custom automations and agents fit their workflows, then taught their teams the tools to act on it.</p><div class="result">Teams automating their own work</div></div>
    <div class="eng rv d2"><span class="where">HR · Dubai</span><h3>Welfare group: AI HR blueprint</h3><p>Automation blueprints for screening, scheduling, offers and onboarding with human approval built in, plus coaching for the internal team.</p><div class="result">System owned in-house</div></div>
  </div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">What I taught</span><h2 class="h-l split">The curriculum</h2></div><p class="lede rv">Tailored to each client and taught hands-on, using their own data and workflows.</p></div>
  <div class="curriculum rv">
    <div class="mod"><small>MODULE 01</small><h4>AI for decision-makers</h4><p>What LLMs can and can't do, and how to spot real opportunities.</p></div>
    <div class="mod"><small>MODULE 02</small><h4>Prompting &amp; AI tools</h4><p>Getting reliable, professional output from ChatGPT, Claude and Gemini.</p></div>
    <div class="mod"><small>MODULE 03</small><h4>Custom automations</h4><p>Building workflows in n8n, Make and Zapier that remove repetitive work.</p></div>
    <div class="mod"><small>MODULE 04</small><h4>AI agents</h4><p>How agents, routers and tools work together, and how to supervise them.</p></div>
    <div class="mod"><small>MODULE 05</small><h4>Governance &amp; privacy</h4><p>Access control, human-in-the-loop design and local-first options for confidential data.</p></div>
    <div class="mod"><small>MODULE 06</small><h4>Ownership &amp; handover</h4><p>Running, monitoring and extending the system without outside help.</p></div>
  </div></div></section>

<section class="sec" style="padding-top:40px"><div class="wrap"><div class="sec-head"><div><span class="eyebrow">How it ran</span><h2 class="h-l split">From audit to independence</h2></div></div>
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
    title: 'Credentials · Stuti Gohil', active: 'credentials', desc: 'Two Oracle Cloud Infrastructure professional certifications, plus courses and programs from Stanford Online, Google, Microsoft, IBM, AWS and more.',
    body: `<section class="phero"><div class="aura" style="width:600px;height:500px;left:30%;top:0;background:rgba(110,240,194,.06)"></div><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Credentials</div><span class="eyebrow">Credentials</span>
  <h1 class="h-xl split" style="margin-top:20px">Certifications, <span class="it">courses and programs.</span></h1>
  <p class="lede rv">Two Oracle Cloud Infrastructure professional certifications earned through proctored exams, plus 40+ certificates of completion from courses and programs at Stanford Online, Google, Microsoft, IBM, AWS, Imperial College London and more.</p></div></section>

<section style="padding-bottom:100px"><div class="wrap">
  <div class="issuer-wall rv">${['Stanford Online', 'Oracle', 'Google', 'Google Cloud', 'Microsoft', 'IBM', 'AWS', 'Imperial College London', 'DeepLearning.AI', 'MongoDB', 'Cisco', 'LinkedIn', 'McKinsey', 'BCG', 'WHO', 'ISRO', 'Goldman Sachs', 'Walmart', 'PepsiCo', 'HP', 'freeCodeCamp', 'Udemy', 'Coursera', 'PMI'].map(i => `<div>${logoFor(i)}<span>${i}</span></div>`).join('')}</div>
  <div class="sec-head"><div><span class="eyebrow">Certifications</span><h2 class="h-m">Certifications (proctored exams)</h2></div></div>
  <div class="cred-feature cred-feature-2">
    <div class="cf rv">${logoFor('Oracle')}<small>Oracle · Certification</small><h3>Oracle Cloud Infrastructure Generative AI Professional</h3><p>Issued Oct 2025. Professional-level certification in LLMs, RAG and GenAI on OCI.</p></div>
    <div class="cf rv d1">${logoFor('Oracle')}<small>Oracle · Certification</small><h3>Oracle Cloud Infrastructure Data Science Professional</h3><p>Issued Oct 2025. Professional-level data science and ML on OCI.</p></div>
  </div>

  <div class="edu-card rv" style="margin-bottom:100px"><div class="l"><span class="eyebrow">Education</span><h2 class="h-m" style="margin:18px 0 10px">B.Tech, Information &amp; Communication Technology</h2><p class="lede">Pandit Deendayal Energy University, Gandhinagar · Nov 2022 to May 2026</p></div>
  <div class="r"><div class="cpi">8.89<small>CPI / 10</small></div></div></div>

  <div class="sec-head"><div><span class="eyebrow">Recognition</span><h2 class="h-l split">Beyond the courses</h2></div></div>
  <div class="awards" style="margin-bottom:110px">
    <div class="award rv"><b>Top 1%</b><p>PepsiCo Sales Star, out of 35,000+ applicants</p></div>
    <div class="award rv d1"><b>McKinsey</b><p>Forward Program</p></div>
    <div class="award rv d2"><b>200K+</b><p>LinkedIn impressions on AI writing</p></div>
    <div class="award rv d3"><b>ISRO</b><p>Course completion, Indian Space Research Organisation</p></div>
  </div>

  <div class="sec-head"><div><span class="eyebrow">Courses and programs</span><h2 class="h-l split">Certificates of completion. Click any to view it.</h2></div></div>
  <div class="filterbar rv" data-filter-group=".cert">${issuers.map((f, k) => `<button class="${k ? '' : 'on'}" data-f="${f}">${labels[f]}</button>`).join('')}</div>
  <div class="cert-grid">${certs.slice(certifications.length).filter(c => c[2]).map(([iss, t, img, tg]) => `<div class="cert rv" data-tags="${tg}"><div class="img"><picture><source srcset="assets/certs/${img}.webp" type="image/webp"><img loading="lazy" decoding="async" src="assets/certs/${img}.jpg" alt="${iss}: ${t} certificate"></picture></div><div class="cap">${logoFor(iss)}<div><small>${iss}</small><b>${t}</b></div></div></div>`).join('')}</div>

  <div class="sec-head" style="margin-top:110px"><div><span class="eyebrow">Also completed</span><h2 class="h-m">More courses and programs</h2></div></div>
  <ul class="cert-list rv">${[...certs.slice(certifications.length).filter(c => !c[2]), ...moreCerts].map(([iss, t]) => `<li>${logoFor(iss)}<div>${t}<span>${iss}</span></div></li>`).join('')}</ul>
</div></section>
<div class="lightbox"><div><img alt=""><p></p></div></div>`
  });
};


// ================= CONTACT =================
const contact = () => layout({
  title: 'Contact · Stuti Gohil', active: '', depth: 0,
  desc: 'Open to full-time AI engineering and full-stack roles. Based in Gandhinagar, India, open to relocate to Bangalore or Mumbai, or remote. Short form, reply within 24 hours.',
  body: `<section class="phero"><div class="wrap"><span class="eyebrow">Contact</span>
  <h1 class="h-xl split" style="margin-top:20px">Let's talk about <span class="it">the role.</span></h1>
  <p class="lede rv" style="margin-top:24px"><strong style="color:var(--ink)">${HIRE}</strong> A few details are enough. I read every message personally and reply within 24 hours.</p>
  <div class="contact-grid">
    <form class="cform rv" id="contact-form" novalidate data-endpoint="https://formsubmit.co/ajax/${EMAIL}">
      <div class="row2"><label>Name<input name="name" type="text" autocomplete="name" required maxlength="80" placeholder="Your name"></label>
      <label>Email<input name="email" type="email" autocomplete="email" required maxlength="120" placeholder="you@company.com"></label></div>
      <label>What do you need?<select name="topic">
        <option>Full-time role</option><option>Discuss a project</option><option value="consulting">Past consulting and training work</option><option>Something else</option></select></label>
      <label>Message<textarea name="message" required minlength="10" maxlength="3000" rows="6" placeholder="Tell me about the role and the team."></textarea></label>
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <div class="cform-foot"><button class="btn btn-gold" type="submit"><span class="lbl">Send message</span> <span class="arr">→</span></button><p class="cform-err" role="alert" hidden></p></div>
    </form>
    <div class="cform-ok" id="contact-ok" hidden role="status"><span class="ok-ic">${ic('checkc')}</span><h2>Message received</h2><p>Thank you. You will get a reply within 24 hours. A confirmation is also on its way to your inbox.</p><a class="btn btn-ghost" href="index.html">Back to home</a></div>
    <aside class="cside rv d2">
      <div class="cbook"><span class="si">${ic('calendar')}</span><b>Prefer to talk?</b><p>Pick a time for a 20-minute intro call.</p><a class="btn btn-gold" href="${CAL}" target="_blank" rel="noopener">Book a call <span class="arr">→</span></a></div>
      <div><span class="si">${ic('clock')}</span><b>Reply within 24 hours</b><p>Every enquiry gets a personal response.</p></div>
      <div><span class="si">${ic('mail')}</span><b>Prefer email?</b><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
      <div><span class="si">${ic('pin')}</span><b>Based in Gandhinagar, India</b><p>Open to relocate to Bangalore or Mumbai, or to work remotely.</p></div>
    </aside>
  </div></div></section>`
});

// ================= RESUME =================
// Content mirrors assets/Stuti_Gohil_AI_Engineer.pdf (resume v2).
const job = (title, org, where, dates, bullets) => `<div class="rjob"><div class="rjob-h"><b>${title}</b> | ${org}, ${where}<span>${dates}</span></div><ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`;
const RESUME = [
  ['Professional experience', [
    job('AI Developer', 'Digital Dada Consulting', 'New York, US (Remote)', 'May 2026 to Present', [
      'Replaced a manual outbound sales workflow with an autonomous system: Vapi voice agents place TCPA-compliant calls, book appointments mid-call and classify lead sentiment with an LLM, producing 100+ enriched B2B leads a day.',
      'Migrated 43 Airtable nodes across 14 production n8n workflows to Supabase with zero downtime, stabilizing the executions behind the client\'s automated email, SMS and voice interactions.',
      'Built and launched Relentless, an SMS-first AI coaching platform for US founders, on Next.js, Supabase and Python/FastAPI, with a model router across GPT-4, Claude and Gemini and RAG retrieval on pgvector.']),
    job('Lead Application Developer (Freelance)', 'Exotic Lobby', 'Dubai, UAE (Remote)', 'Apr 2026 to Present', [
      'Built and shipped, as sole developer, the Exotic Lobby iOS/Android app (live on Google Play and the App Store), the public website and the admin web platform for a private hypercar network across Europe, the Middle East and the US, on React Native, TypeScript and Supabase.',
      'Delivered real-time location tracking, convoy chat, Mapbox maps, events, garage inventories and service booking with Supabase Edge Functions and WebSocket, secured by PostgreSQL row-level security.',
      'Cut media payload 80% (68MB to 14MB) by migrating 73 assets off a failing third-party CDN to Supabase, resolving international access failures; built role-based admin dashboards for community leaders and admins.']),
    job('AI Consultant and Trainer (Contract)', 'Private Clients', 'Europe / Dubai, UAE (Remote)', 'Mar 2026 to Aug 2026', [
      'Designed and deployed a local-first multi-agent system for a European film director: 1 orchestrator and 10 sub-agents on n8n, Docker and Ollama, with a single intent router and per-agent least-privilege tool access; trained the client to run it independently.',
      'Broke a Dubai welfare group\'s HR operations (screening, scheduling, onboarding) into automation blueprints with human approval on every decision, and taught the team to build custom automations on top of their CRM.']),
    job('AI Developer Intern', 'SporTech Innovation Lab', 'Pune, India (Remote)', 'Jan 2026 to Jul 2026', [
      'Delivered the LevelUp Northeast 2026 (CII/IDGS) registration portal on Next.js, React and TailwindCSS, deployed to Vercel and Azure Container Apps, serving 5,000+ users on launch day with zero data corruption.',
      'Built a fault-tolerant Node.js CSV ingestion engine with concurrency control, dry-run validation before any write, malformed-row recovery and deterministic 64-bit certificate IDs.',
      'Designed a two-tier RAG answering in under 500ms (PostgreSQL tsvector and pgvector HNSW with Redis cache) with a deep-RAG fallback on FastAPI, Qdrant and Gemini; delivered in Scrum with Jira and Confluence.']),
    job('Software Developer Intern', 'Infosoft LLC', 'Colorado Springs, US (Remote)', 'May 2025 to Jul 2025', [
      'Created Selvenza, a CI/CD-ready tool that detects and heals UI selector drift in React/Vite through DOM snapshot diffing and automated test refactoring, saving 40+ QA hours per release.',
      'Built the Node.js backend and REST APIs for test orchestration, reporting and GitHub Actions integration, with Docker test environments, in bi-weekly Agile sprints.']),
  ].join('')],
  ['Live projects', `<ul class="rproj">
      <li><b>YourInboxHero</b>: recently launched platform that recovers late invoice payments for small businesses by escalating reminders from email to SMS to voice until paid; sole developer, 109+ automated tests gating every deploy, signature-verified Stripe webhooks, zero-loss SQLite to PostgreSQL migration.</li>
      <li><b>SOPBot + WorkflowIQ</b>: built at Digital Dada; an LLM pipeline with schema-bound output turns a phone call into a structured SOP in Google Docs, and WorkflowIQ ranks processes by impact and time saved so the highest-ROI workflow is automated first.</li>
      <li><b>InvoiceChaser</b>: invoice-collections agent for SMBs (first market UAE) with a public interactive demo, chasing overdue payments over email, SMS, WhatsApp and voice with English/Arabic templates; deterministic state machine, due-date policy engine, strict-schema reply reader, quiet hours, auto-stop on payment, day-30 human handover and an append-only audit log across four autonomy tiers.</li>
      <li><b>A Square Merch</b>: self-initiated merchandise storefront, designed and deployed end to end on Vercel.</li></ul>`],
  ['Technical skills', `<dl class="rskills">
      <dt>Languages</dt><dd>Python, TypeScript, JavaScript, SQL</dd>
      <dt>AI and LLM</dt><dd>OpenAI GPT-4, Anthropic Claude, Google Gemini, Ollama, LangChain, LangGraph, CrewAI, RAG, prompt engineering, tool calling, structured outputs, multi-agent systems, intent routing, human-in-the-loop, Vapi, Whisper, ElevenLabs</dd>
      <dt>Full-Stack</dt><dd>FastAPI, Node.js, Next.js, React, React Native, TailwindCSS, PostgreSQL, Supabase, pgvector, Qdrant, Redis, MongoDB, Prisma, REST APIs, GraphQL, webhooks</dd>
      <dt>Automation and Integrations</dt><dd>n8n, Make, Zapier, Twilio, Stripe, GoHighLevel, Mapbox, CRM automation, email, SMS, WhatsApp and voice channels</dd>
      <dt>DevOps and Ways of Working</dt><dd>Docker, GitHub Actions, CI/CD, Vercel, AWS, Azure Container Apps, Playwright, automated testing, Agile/Scrum, Jira, Confluence</dd></dl>`],
  ['Education', `<div class="rjob"><div class="rjob-h"><b>B.Tech, Information and Communication Technology, CPI 8.89/10</b> | Pandit Deendayal Energy University<span>Nov 2022 to May 2026</span></div></div>`],
  ['Certifications and achievements', `<ul class="rproj">
      <li><b>Certifications:</b> Oracle Cloud Infrastructure Generative AI Professional · Oracle Cloud Infrastructure Data Science Professional (<a href="credentials.html">view all</a>)</li>
      <li><b>Courses, programs and awards:</b> IBM Machine Learning (Honors) · Google Advanced Generative AI · Microsoft Power BI Data Analyst · McKinsey Forward Program · PMI Project Management · Top 1% in PepsiCo Sales Star (35,000+ applicants)</li></ul>`],
];
const resume = () => layout({
  title: 'Resume · Stuti Gohil', active: 'resume', desc: 'Resume of Stuti Gohil, AI Engineer: LLM agents, RAG and workflow automation, full-stack in Python and TypeScript. Open to full-time roles.',
  body: `<section class="phero"><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / Resume</div><span class="eyebrow">Resume</span>
  <h1 class="h-xl split" style="margin-top:20px">Stuti Gohil</h1>
  <p class="lede rv resume-headline" style="margin-top:20px">AI Engineer | LLM Agents, RAG and Workflow Automation | Full-Stack (Python, TypeScript)</p>
  <p class="resume-contact rv">Gandhinagar, India (open to relocate: Bangalore, Mumbai) · Notice period: 15 days · ${PHONE} · <a href="mailto:${EMAIL}">${EMAIL}</a><br><a href="https://linkedin.com/in/stuti-gohil" target="_blank" rel="noopener">linkedin.com/in/stuti-gohil</a> · <a href="https://github.com/Stuti-1908" target="_blank" rel="noopener">github.com/Stuti-1908</a></p>
  <div class="btns rv" style="margin-top:28px"><a class="btn btn-gold" href="${RESUME_PDF}" download>Download PDF <span class="arr">↓</span></a><a class="btn btn-ghost" href="${RESUME_PDF}" target="_blank" rel="noopener">Open full screen ↗</a><a class="btn btn-ghost" href="contact.html">Contact me</a></div>
  <div class="resume-doc rv">
${RESUME.map(([h, items]) => `    <section><h2>${h}</h2>${items}</section>`).join('\n')}
  </div>
  </div></section>`
});

// ================= WRITE =================
const pages = [];
const out = (file, html) => { pages.push(file); const url = `${SITE}/${file === 'index.html' ? '' : file}`; html = html.replaceAll('{{CANON}}', url); const p = join(ROOT, file); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, html); };
out('index.html', home());
out('work.html', work());
out('consulting.html', consulting());
out('credentials.html', credentials());
out('contact.html', contact());
out('resume.html', resume());
projects.forEach((p, i) => out(`work/${p.slug}.html`, caseStudy(p, i)));

// ---------- knowledge file for the "Ask my portfolio" chat (api/ask.js) ----------
const strip = s => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const kb = [
  `# Stuti Gohil: AI Engineer`,
  `Headline: AI Engineer | LLM Agents, RAG and Workflow Automation | Full-Stack (Python, TypeScript). Builds voice agents, document and payment automation, RAG platforms and full AI products, shipped end to end. Owns the whole lifecycle (discovery, architecture, build, launch, handover) and plugs into existing teams.`,
  `Hiring status: ${HIRE} Contact form: ${SITE}/contact.html. Email: ${EMAIL}. LinkedIn: https://linkedin.com/in/stuti-gohil. GitHub: https://github.com/Stuti-1908. Resume: ${SITE}/resume.html (PDF: ${SITE}/${RESUME_PDF}). Intro call: ${CAL}.`,
  `Experience (most recent first): AI Developer, Digital Dada Consulting, New York, US (Remote), May 2026 to Present. Lead Application Developer (Freelance), Exotic Lobby, Dubai, UAE (Remote), Apr 2026 to Present. AI Consultant and Trainer (Contract), Private Clients, Europe / Dubai, UAE (Remote), Mar 2026 to Aug 2026. AI Developer Intern, SporTech Innovation Lab, Pune, India (Remote), Jan 2026 to Jul 2026. Software Developer Intern, Infosoft LLC, Colorado Springs, US (Remote), May 2025 to Jul 2025.`,
  `Past consulting and training work (Mar 2026 to Aug 2026, private clients): an 11-agent private AI system for a European film director, and an AI HR blueprint plus team training for a Dubai welfare group. Success was measured by how independent the client was afterwards. Consulting is past work, not a current service.`,
  `Skills: (1) AI agents and multi-agent systems (LangGraph, CrewAI, n8n, Ollama, Vapi); (2) mobile and web products (React Native, Next.js, Supabase, TypeScript); (3) RAG and LLM engineering (pgvector, Qdrant, Redis, GPT-4, Claude, Gemini); (4) workflow automation (n8n, Make, Zapier, Twilio).`,
  `Education: B.Tech in Information & Communication Technology, Pandit Deendayal Energy University, Gandhinagar (Nov 2022 to May 2026), CPI 8.89/10.`,
  ...projects.map(p => [
    `\n## Project: ${p.title} (${SITE}/work/${p.slug}.html)`,
    `Client: ${p.client}. Region: ${p.region}. Year: ${p.year}. Role: ${p.role}. Platform: ${p.platform}. Status: ${p.status}.${p.live ? ` Live at ${p.live}.` : ''}`,
    `Summary: ${strip(p.oneLine)}`,
    `Brief: ${p.brief.map(strip).join(' ')}`,
    `Challenges: ${p.challenges.map(strip).join(' | ')}`,
    `Features: ${p.features.map(f => `${f[1]}: ${strip(f[2])}`).join(' | ')}`,
    `Key decisions: ${p.decisions.map(d => `${d[0]}: ${strip(d[1])}`).join(' | ')}`,
    `Outcomes: ${p.outcomes.map(o => `${o[0]} ${o[1]}`).join('; ')}`,
    owned[p.slug] ? `What Stuti personally owned: ${owned[p.slug].join('; ')}` : '',
    `Stack: ${p.stack.join(', ')}`,
  ].filter(Boolean).join('\n')),
  `\n## Certifications (the only two proctored-exam certifications)`,
  certifications.map(c => `${c[0]}: ${c[1]}`).join('; '),
  `\n## Courses and programs (certificates of completion, not certifications; for example the AWS item is an exam readiness course, not an AWS certification)`,
  [...certs.slice(certifications.length), ...moreCerts].map(c => `${c[0]}: ${c[1]}`).join('; '),
].join('\n');
writeFileSync(join(ROOT, 'api/_portfolio.js'), `// Generated by _build/build.mjs from _build/data.mjs. Do not edit by hand.\nexport const PORTFOLIO = ${JSON.stringify(kb)};\nexport const CAL = ${JSON.stringify(CAL)};\n`);

// sitemap + robots
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(f => `  <url><loc>${SITE}/${f === 'index.html' ? '' : f}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${6 + projects.length} pages`);
