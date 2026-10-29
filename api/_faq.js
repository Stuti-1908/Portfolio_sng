// Offline answers used when the AI model is unavailable (no key, quota reached, network error).
// Each entry: keywords to match in the visitor's question, and a plain-text answer.
const S = 'https://portfolio-self-beta-46.vercel.app';
export const FAQ = [
  [['voice', 'call', 'phone', 'vapi', 'sales agent'], `Yes. Stuti built an autonomous voice sales agent that books meetings during the call, and SOPBot, where teams phone a number and get a finished SOP. See ${S}/work/voice-agent.html and ${S}/work/sopbot.html`],
  [['inbox', 'invoice', 'payment', 'document', 'chasing', 'collection'], `YourInboxHero is a SaaS Stuti built end to end: it chases overdue invoices and missing documents automatically, escalating from email to SMS to voice calls and stopping the moment an invoice is paid. Stack: FastAPI, React 19, PostgreSQL, Stripe. ${S}/work/yourinboxhero.html`],
  [['full time', 'full-time', 'job', 'role', 'hire', 'hiring', 'join', 'team', 'available', 'open to'], `Yes. Stuti is open to new AI builds and team roles. The quickest way to talk is a 20-minute intro call: https://cal.com/stuti-sg19`],
  [['rag', 'retrieval', 'vector', 'embedding', 'llm'], `Stuti builds production RAG and LLM systems, for example GoeCoach, an SMS AI coach answering in under 500 ms using pgvector and Redis. ${S}/work/goecoach.html`],
  [['agent', 'multi-agent', 'orchestr', 'n8n', 'ollama', 'local'], `She built an 11-agent private AI operating system for a film director that runs fully on local hardware with an intent router. ${S}/work/agent-os.html`],
  [['mobile', 'ios', 'android', 'app', 'react native'], `Exotic Lobby: a private hypercar network on iOS, Android and web that Stuti built solo, with live convoy tracking, chat and events. ${S}/work/exotic-lobby.html`],
  [['automat', 'workflow', 'manual', 'zapier', 'make'], `Stuti takes manual operations work off teams: document and payment chasing, SOP capture, HR workflows and custom automations. Tell her about your process on a quick call: https://cal.com/stuti-sg19`],
  [['consult', 'training', 'workshop', 'teach'], `She consults and trains leaders in Dubai, Europe and the US on AI, automation and agents, aiming for teams that run the systems themselves. ${S}/consulting.html`],
  [['stack', 'tech', 'skill', 'language', 'framework'], `Core stack: Python, FastAPI, TypeScript, React, Next.js, React Native, Supabase and PostgreSQL, pgvector, Redis, n8n, Docker, plus GPT, Claude and Gemini models.`],
  [['cert', 'education', 'degree', 'university', 'cgpa', 'cpi'], `B.Tech in ICT from Pandit Deendayal Energy University (CPI 8.89/10), plus 40+ certifications including Oracle OCI GenAI Professional and Stanford Advanced Learning Algorithms. ${S}/credentials.html`],
  [['resume', 'cv'], `You can view or download her resume here: ${S}/resume.html`],
  [['contact', 'email', 'reach', 'price', 'cost', 'rate', 'budget'], `Email sng19.work@gmail.com or book a 20-minute call: https://cal.com/stuti-sg19`],
];
export function faqAnswer(q) {
  const t = q.toLowerCase();
  let best = null, score = 0;
  for (const [keys, a] of FAQ) { const s = keys.filter(k => t.includes(k)).length; if (s > score) { score = s; best = a; } }
  return best || `I can tell you about Stuti's projects (voice agents, YourInboxHero, RAG, mobile apps), skills and availability. For anything specific, book a 20-minute call: https://cal.com/stuti-sg19`;
}
