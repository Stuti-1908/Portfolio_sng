// Offline answers used when the AI model is unavailable (no key, quota reached, network error).
// Each entry: keywords to match in the visitor's question, and a plain-text answer.
const S = 'https://portfolio-self-beta-46.vercel.app';
export const FAQ = [
  [['voice', 'call', 'phone', 'vapi', 'sales agent'], `Yes. Stuti built an autonomous voice sales agent that books meetings during the call, and SOPBot, where teams phone a number and get a finished SOP. See ${S}/work/voice-agent.html and ${S}/work/sopbot.html`],
  [['inbox', 'invoice', 'payment', 'document', 'chasing', 'collection'], `YourInboxHero is a SaaS Stuti built end to end: it chases overdue invoices and missing documents automatically, escalating from email to SMS to voice calls and stopping the moment an invoice is paid. Stack: FastAPI, React 19, PostgreSQL, Stripe. ${S}/work/yourinboxhero.html`],
  [['full time', 'full-time', 'job', 'role', 'hire', 'hiring', 'join', 'team', 'available', 'open to'], `Yes. Stuti is open to full-time AI engineering and full-stack roles. She is based in Gandhinagar, India, open to relocate to Bangalore or Mumbai, or to work remotely. Resume: ${S}/resume.html. Contact: ${S}/contact.html`],
  [['rag', 'retrieval', 'vector', 'embedding', 'llm'], `Stuti builds production RAG and LLM systems, for example Relentless, an SMS-first AI coach with RAG retrieval on pgvector (${S}/work/relentless.html), and a two-tier RAG answering in under 500 ms for the LevelUp Northeast portal at SporTech Innovation Lab (${S}/work/levelup.html).`],
  [['agent', 'multi-agent', 'orchestr', 'n8n', 'ollama', 'local'], `She built an 11-agent private AI operating system for a film director that runs fully on local hardware with an intent router. ${S}/work/agent-os.html`],
  [['mobile', 'ios', 'android', 'app', 'react native'], `Exotic Lobby: a private hypercar network on iOS, Android and web that Stuti built solo, with live convoy tracking, chat and events. ${S}/work/exotic-lobby.html`],
  [['automat', 'workflow', 'manual', 'zapier', 'make'], `Stuti takes manual operations work off teams: document and payment chasing, SOP capture, HR workflows and custom automations. See her case studies at ${S}/work.html or get in touch: ${S}/contact.html`],
  [['consult', 'training', 'workshop', 'teach'], `From Mar 2026 to Aug 2026 she worked as a contract AI consultant and trainer for private clients in Europe and Dubai, building AI systems and training the teams to run them. That is past work; she is now looking for full-time roles. ${S}/consulting.html`],
  [['stack', 'tech', 'skill', 'language', 'framework'], `Core stack: Python, FastAPI, TypeScript, React, Next.js, React Native, Supabase and PostgreSQL, pgvector, Redis, n8n, Docker, plus GPT, Claude and Gemini models.`],
  [['cert', 'education', 'degree', 'university', 'cgpa', 'cpi'], `B.Tech in ICT from Pandit Deendayal Energy University (CPI 8.89/10), She holds two certifications, Oracle Cloud Infrastructure Generative AI Professional and Oracle Cloud Infrastructure Data Science Professional, plus 40+ certificates from courses and programs (Stanford Online, Google, Microsoft, IBM, AWS and others). ${S}/credentials.html`],
  [['resume', 'cv'], `You can view or download her resume here: ${S}/resume.html`],
  [['contact', 'email', 'reach', 'price', 'cost', 'rate', 'budget'], `Email sng19.work@gmail.com or use the contact form: ${S}/contact.html`],
];
export function faqAnswer(q) {
  const t = q.toLowerCase();
  let best = null, score = 0;
  for (const [keys, a] of FAQ) { const s = keys.filter(k => t.includes(k)).length; if (s > score) { score = s; best = a; } }
  return best || `I can tell you about Stuti's projects (voice agents, YourInboxHero, RAG, mobile apps), skills and availability. For anything specific, use the contact form: ${S}/contact.html`;
}
