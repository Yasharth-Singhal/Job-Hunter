import axios from 'axios';
import { StoreService } from './store.service.js';
import { ResumeProfile } from '../types.js';

export class InterviewAiService {
  private static getGeminiKey(): string | undefined {
    const auto = StoreService.getAutomation();
    return process.env.GEMINI_API_KEY || auto?.geminiApiKey;
  }

  public static setGeminiKey(key: string): void {
    const cleanKey = key.trim();
    process.env.GEMINI_API_KEY = cleanKey;
    StoreService.updateAutomation({ geminiApiKey: cleanKey });
  }

  // --- 1. Answer Custom Text Interview Question ---
  public static async answerCustomQuestion(
    question: string,
    profile?: ResumeProfile
  ): Promise<string> {
    const apiKey = this.getGeminiKey();
    const cleanQ = question.trim();

    if (apiKey) {
      try {
        const response = await this.queryGeminiText(cleanQ, profile, apiKey);
        if (response) return response;
      } catch (err: any) {
        console.warn('[InterviewAiService] Gemini API call failed, falling back to local engine:', err.message);
      }
    }

    return this.answerLocally(cleanQ, profile);
  }

  // --- 2. Process Voice Note (Audio) ---
  public static async processVoiceQuestion(
    audioBuffer: Buffer,
    mimeType = 'audio/ogg',
    profile?: ResumeProfile
  ): Promise<{ transcribedText?: string; answer: string }> {
    const apiKey = this.getGeminiKey();

    if (!apiKey) {
      return {
        answer: `🎙️ <b>Voice Note Received!</b>\n\n` +
          `To enable automatic <b>AI Speech-to-Text & Voice-Chat Answers</b>, simply link your free Google Gemini API key by sending:\n` +
          `<code>/setgemini YOUR_FREE_KEY</code>\n\n` +
          `<i>(Google AI keys are 100% free with no credit card at <a href="https://aistudio.google.com/">aistudio.google.com</a>)</i>\n\n` +
          `💡 <b>In the meantime, you can ask your question directly as text:</b>\n` +
          `<code>/ask Your question here</code>`
      };
    }

    try {
      const base64Audio = audioBuffer.toString('base64');
      const candName = profile?.name || 'Yasharth Singhal';
      const prompt = `The candidate (${candName}, Full Stack Software Engineer) sent an audio voice message containing an interview question or answer for mock interview practice.
Please:
1. Transcribe the spoken words verbatim under "Transcribed Question:".
2. Act as a Staff Technical Interviewer at a top tier company (e.g. Google, Stripe) and provide a concise, high-impact model answer formatted for Telegram HTML (<b>, <i>, <code>, <pre>):
- Direct Concept Key
- Model Verbal Pitch (how to say it convincingly in 60 seconds)
- What Evaluators Look For
- Red Flags to Avoid.
If the candidate was answering a behavioral question, evaluate their response using the STAR framework (Situation, Task, Action, Result).`;

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Audio
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      };

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
        payload,
        { timeout: 35000 }
      );

      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return {
          transcribedText: 'Voice Question Processed with Gemini Multimodal AI',
          answer: `🎙️ <b>AI Voice Interview Feedback:</b>\n\n${text}`
        };
      }
    } catch (err: any) {
      console.error('[InterviewAiService] Gemini audio processing error:', err.message);
    }

    return {
      answer: `⚠️ <b>Voice Audio Processing Error:</b>\n\nCould not process the audio file with Gemini API. Please ensure your API key has quota or type the question with <code>/ask your question</code>.`
    };
  }

  // --- Private Gemini Call for Text ---
  private static async queryGeminiText(
    question: string,
    profile?: ResumeProfile,
    apiKey?: string
  ): Promise<string | null> {
    const candName = profile?.name || 'Yasharth Singhal';
    const skills = (profile?.coreSkills || ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL']).join(', ');

    const prompt = `You are an elite Senior Staff Engineer & Technical Interviewer at a premier technology company (Google, Amazon, Stripe).
You are conducting a high-stakes mock interview with ${candName}, a Full Stack Engineer specializing in ${skills}.

The candidate asks or needs preparation for this interview question:
"${question}"

Provide a concise, practical, senior-level response formatted strictly using Telegram HTML tags (<b>, <i>, <code>, <pre>):
1. 💡 <b>Executive Core Concept:</b> 1-2 sentence razor-sharp definition.
2. 🔑 <b>Model Verbal Pitch (How to say it in 60-90 seconds):</b> Exactly what to speak to impress the interviewer.
3. 🛠️ <b>Technical Architecture / STAR Breakdown:</b> Code snippet, architecture trade-offs, or STAR bullets.
4. 🎯 <b>What Evaluators Look For:</b> The underlying competency being tested.
5. 🚩 <b>Common Red Flags to Avoid:</b> Weak answers that get candidates rejected.

Keep it compact and punchy for mobile Telegram reading.`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1100 }
      },
      { timeout: 30000 }
    );

    const generated = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return generated ? `🎙️ <b>AI Custom Interview Answer Key:</b>\n\n${generated}` : null;
  }

  // --- Offline / Built-in Local Knowledge Base ---
  private static answerLocally(question: string, profile?: ResumeProfile): string {
    const q = question.toLowerCase();

    // 1. React & Next.js Hooks / Lifecycle
    if (q.includes('useeffect') || q.includes('hook') || q.includes('cleanup')) {
      return `💡 <b>Mastering React useEffect & Cleanup Lifecycle:</b>\n\n` +
        `<b>Direct Concept:</b> <code>useEffect</code> synchronizes a React component with an external system (APIs, DOM listeners, timers, WebSockets).\n\n` +
        `🔑 <b>Model Verbal Pitch:</b>\n` +
        `<i>"I treat useEffect as an escape hatch for side-effects rather than a tool for data flow. When subscribing to events or starting timers, returning a cleanup function is vital to prevent memory leaks, stale closures, and race conditions when dependencies change or the component unmounts."</i>\n\n` +
        `🛠️ <b>Code Implementation Pattern:</b>\n` +
        `<pre>useEffect(() => {\n  let isMounted = true;\n  const sub = api.stream(data => {\n    if (isMounted) setState(data);\n  });\n  return () => { isMounted = false; sub.unsubscribe(); };\n}, [api]);</pre>\n\n` +
        `🎯 <b>What Evaluators Look For:</b> Understanding race conditions, cleanup functions, and avoiding premature over-effects.\n` +
        `🚩 <b>Red Flags:</b> Omitting dependency arrays or mutating state inside effects without dependency checks (causing infinite loops).`;
    }

    if (q.includes('usememo') || q.includes('usecallback') || q.includes('re-render') || q.includes('rerender')) {
      return `💡 <b>React Performance: useMemo vs useCallback:</b>\n\n` +
        `<b>Direct Concept:</b> <code>useMemo</code> caches the *result* of a calculation. <code>useCallback</code> caches a *function reference* between renders.\n\n` +
        `🔑 <b>Model Verbal Pitch:</b>\n` +
        `<i>"In React, functions and object literals are re-created by reference on every render. If passed to memoized children (React.memo), this breaks shallow equality. I apply useCallback to preserve reference equality and useMemo for expensive CPU-heavy computations—always verifying bottlenecks with the React DevTools Profiler rather than guessing."</i>\n\n` +
        `🎯 <b>What Evaluators Look For:</b> Explaining reference equality and cost of memoization overhead.\n` +
        `🚩 <b>Red Flags:</b> Wrapping every trivial function in useCallback, which adds unnecessary memory overhead without performance benefit.`;
    }

    if (q.includes('closure') || q.includes('event loop') || q.includes('async') || q.includes('promise')) {
      return `💡 <b>JavaScript Asynchronous Concurrency & Closures:</b>\n\n` +
        `<b>Direct Concept:</b> JavaScript is single-threaded with an event-driven non-blocking concurrency model powered by Call Stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (timers/I/O).\n\n` +
        `🔑 <b>Model Verbal Pitch:</b>\n` +
        `<i>"Closures enable a function to retain lexical scope access even when executed outside that scope. When combined with the event loop, Promises resolve via the higher-priority microtask queue before the next macrotask (setTimeout). This explains why Promise.resolve() fires ahead of setTimeout(..., 0)."</i>\n\n` +
        `🎯 <b>What Evaluators Look For:</b> Microtask queue priority vs macrotasks, and preventing memory leaks in long-lived closures.\n` +
        `🚩 <b>Red Flags:</b> Claiming JavaScript is multi-threaded without mentioning Node.js worker threads or Web Workers.`;
    }

    // 2. Database & SQL vs NoSQL
    if (q.includes('sql') || q.includes('nosql') || q.includes('index') || q.includes('postgres') || q.includes('mongo')) {
      return `💡 <b>Database Architecture: Relational (PostgreSQL) vs NoSQL (MongoDB):</b>\n\n` +
        `<b>Direct Concept:</b> Relational databases prioritize strict ACID transactions, schema consistency, and complex relational JOINs. NoSQL systems optimize for flexible polymorphic schemas and horizontal sharding.\n\n` +
        `🔑 <b>Model Verbal Pitch:</b>\n` +
        `<i>"For financial ledgers, transactional consistency, and complex entity relations, I rely on PostgreSQL with B-tree indexing and normalized schemas. For high-velocity document storage with dynamic schemas or rapid prototypes, MongoDB provides agile modeling. On high-volume tables, I run EXPLAIN ANALYZE to identify sequential scans and add compound indexes on query predicates."</i>\n\n` +
        `🎯 <b>What Evaluators Look For:</b> Trade-offs (ACID vs BASE, B-Tree index costs on writes, horizontal vs vertical scaling).\n` +
        `🚩 <b>Red Flags:</b> Blindly stating 'NoSQL is always faster' without acknowledging write latency or lack of relational constraints.`;
    }

    // 3. System Design & Scaling
    if (q.includes('system design') || q.includes('scale') || q.includes('cache') || q.includes('redis') || q.includes('queue') || q.includes('kafka')) {
      return `💡 <b>System Design & Distributed Scalability Strategy:</b>\n\n` +
        `<b>Direct Concept:</b> High-scale architectures decouple monolithic workloads using Layer 7 Load Balancers (NGINX/ALB), in-memory distributed caches (Redis), and asynchronous message queues (BullMQ/RabbitMQ/Kafka).\n\n` +
        `🔑 <b>Model Verbal Pitch:</b>\n` +
        `<i>"When scaling services, I identify database bottlenecks first and place a Redis cache-aside layer with strict TTLs and eviction policies (LRU). For spike-prone operations like automated notifications or PDF exports, I offload tasks into BullMQ message queues with idempotency keys and exponential backoff retries, ensuring 99.9% uptime."</i>\n\n` +
        `🎯 <b>What Evaluators Look For:</b> Cache stampede prevention, idempotency, horizontal auto-scaling, and single points of failure.\n` +
        `🚩 <b>Red Flags:</b> Designing synchronous distributed microservices without circuit breakers or fallback queues.`;
    }

    // 4. STAR Behavioral
    if (q.includes('conflict') || q.includes('roadblock') || q.includes('deadline') || q.includes('failure') || q.includes('mistake') || q.includes('star')) {
      return `⭐ <b>STAR Behavioral Framework Model:</b>\n\n` +
        `<b>Target Scenario:</b> "${question}"\n\n` +
        `📐 <b>Structured STAR Delivery:</b>\n` +
        `• <b>Situation (15s):</b> <i>"At Startappss System India, during a major deployment of our headless e-commerce service..."</i>\n` +
        `• <b>Task (15s):</b> <i>"We faced high latency due to un-cached GraphQL queries that threatened our SLA deadline."</i>\n` +
        `• <b>Action (45s):</b> <i>"I conducted code profiling, identified duplicate data fetching, introduced Redis response caching with automated cache invalidation, and set up staging benchmark tests."</i>\n` +
        `• <b>Result (15s):</b> <i>"Query latency dropped by 64%, API throughput doubled, and we launched 2 days ahead of schedule with zero rollbacks."</i>\n\n` +
        `🎯 <b>What Evaluators Look For:</b> Ownership, technical reasoning, collaborative conflict resolution, and quantifiable metrics.\n` +
        `🚩 <b>Red Flags:</b> Blaming teammates, using vague 'we did this' without specifying personal ownership, or lacking measurable results.`;
    }

    // 5. General Fallback
    return `🎙️ <b>Interview Preparation Strategy for:</b>\n<i>"${question}"</i>\n\n` +
      `💡 <b>Recommended Interview Answer Structure:</b>\n\n` +
      `1. <b>Definition (15 sec):</b> State the core mechanism directly without rambling.\n` +
      `2. <b>Real-World Trade-Offs (30 sec):</b> Mention when to use it, why it is chosen over alternatives, and memory/CPU trade-offs.\n` +
      `3. <b>Hands-On Example (30 sec):</b> Reference a production project from your stack (React, Next.js, Node.js, PostgreSQL).\n` +
      `4. <b>Edge Cases (15 sec):</b> Mention error handling, performance pitfalls, or security risks.\n\n` +
      `💬 <i>Tip: To get real-time generative AI answers on any custom question, link your free Google Gemini API key by typing:</i>\n<code>/setgemini YOUR_FREE_KEY</code>`;
  }
}
