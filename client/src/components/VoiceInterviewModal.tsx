import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  ChevronRight, 
  Award, 
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { Job, ResumeProfile } from '../types';

interface VoiceInterviewModalProps {
  job: Job | null;
  profile: ResumeProfile | null;
  onClose: () => void;
}

export const VoiceInterviewModal: React.FC<VoiceInterviewModalProps> = ({ job, profile, onClose }) => {
  if (!job) return null;

  const questions = [
    ...(job.interviewPrep?.technicalQuestions.map(t => ({
      type: 'Technical',
      question: t.question,
      modelAnswer: t.answerKey,
      criteria: t.whatHrLooksFor
    })) || []),
    ...(job.interviewPrep?.behavioralQuestions.map(b => ({
      type: 'Behavioral (STAR)',
      question: b.question,
      modelAnswer: b.sampleAnswer,
      criteria: b.starStrategy
    })) || [
      {
        type: 'General',
        question: `Tell me about yourself and why you're a great fit for the ${job.title} role at ${job.company}.`,
        modelAnswer: `Lead with your hands-on background in ${(profile?.coreSkills || ['React', 'Node.js']).join(', ')}, highlight your production experience, and tie it directly to ${job.company}'s mission.`,
        criteria: 'Clear 90-second elevator pitch connecting your past projects to job requirements.'
      }
    ])
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<{
    wordCount: number;
    wpm: number;
    fillerWords: string[];
    starDetected: { situation: boolean; task: boolean; action: boolean; result: boolean };
    score: number;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const currentQ = questions[currentIdx] || questions[0];

  // Speak question via Web Speech Synthesis
  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Start Mic Recording via SpeechRecognition
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    stopSpeaking();
    setTranscript('');
    setAnalysis(null);
    startTimeRef.current = Date.now();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let fullText = '';
      for (let i = 0; i < event.results.length; i++) {
        fullText += event.results[i][0].transcript + ' ';
      }
      setTranscript(fullText.trim());
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    analyzeAnswer(transcript);
  };

  const analyzeAnswer = (text: string) => {
    const durationMin = Math.max(0.1, (Date.now() - startTimeRef.current) / 60000);
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const wpm = Math.round(wordCount / durationMin);

    // Filler words detection
    const commonFillers = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];
    const detectedFillers: string[] = [];
    commonFillers.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        detectedFillers.push(`${filler} (${matches.length}x)`);
      }
    });

    // STAR framework detection
    const starDetected = {
      situation: /situation|context|problem|challenge|client|project/i.test(text),
      task: /task|goal|objective|responsible|assigned/i.test(text),
      action: /i built|i designed|i implemented|i optimized|i resolved|i led|action/i.test(text),
      result: /result|metric|improved|increased|decreased|shipped|outcome|percent|%/i.test(text)
    };

    // Calculate quality score out of 100
    let score = 50;
    if (wordCount > 40) score += 15;
    if (wpm >= 110 && wpm <= 165) score += 15; // optimal speaking rate
    if (detectedFillers.length <= 1) score += 10;
    if (starDetected.action) score += 5;
    if (starDetected.result) score += 5;

    setAnalysis({
      wordCount,
      wpm,
      fillerWords: detectedFillers,
      starDetected,
      score: Math.min(98, score)
    });
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Voice Mock Interview Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Live Voice Practice
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {job.title} at {job.company} • Question {currentIdx + 1} of {questions.length}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Selector Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-950/40 border-b border-zinc-800 overflow-x-auto">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIdx(idx);
                setTranscript('');
                setAnalysis(null);
                stopSpeaking();
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all whitespace-nowrap ${
                currentIdx === idx
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              Q{idx + 1} ({q.type.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Question Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 uppercase">
                  {currentQ.type}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">
                  "{currentQ.question}"
                </h3>
              </div>

              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakQuestion(currentQ.question)}
                className={`p-2 rounded-lg border transition-all ${
                  isSpeaking
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 animate-pulse'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen to interviewer speak question'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400">
              <strong className="text-zinc-300">What the Interviewer Evaluates:</strong> {currentQ.criteria}
            </div>
          </div>

          {/* Recording / Voice Control Center */}
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all scale-100 hover:scale-105"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Answering via Microphone</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-lg shadow-red-500/20 animate-pulse transition-all"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop & Analyze Answer</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-500">
              {isRecording 
                ? '🔴 Listening to your voice... Speak clearly using the STAR structure.' 
                : 'Click the button and practice speaking your answer out loud.'}
            </p>

            {/* Live Transcript View */}
            {transcript && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-xs text-zinc-200 font-mono leading-relaxed max-h-32 overflow-y-auto">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Your Spoken Answer:</span>
                "{transcript}"
              </div>
            )}
          </div>

          {/* Speech & Quality Analytics Feedback */}
          {analysis && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-950/40 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Speech Quality Diagnosis</h4>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400">{analysis.score} / 100 Score</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">Speaking Pace</div>
                  <div className="font-mono font-bold text-white mt-0.5">{analysis.wpm} WPM</div>
                  <div className="text-[9px] text-zinc-500">{analysis.wpm >= 110 && analysis.wpm <= 165 ? 'Optimal' : 'Slightly fast/slow'}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">Word Count</div>
                  <div className="font-mono font-bold text-white mt-0.5">{analysis.wordCount} words</div>
                  <div className="text-[9px] text-zinc-500">{analysis.wordCount >= 50 ? 'Good depth' : 'Too brief'}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">Filler Words</div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">{analysis.fillerWords.length}</div>
                  <div className="text-[9px] text-zinc-500 truncate">{analysis.fillerWords.join(', ') || 'Clean & direct'}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="text-zinc-400 text-[10px]">STAR Check</div>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">
                    {Object.values(analysis.starDetected).filter(Boolean).length} / 4
                  </div>
                  <div className="text-[9px] text-zinc-500">S T A R Elements</div>
                </div>
              </div>

              {/* Ideal Model Answer Accordion */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-zinc-300 block mb-1">Recommended Model Answer:</span>
                <p className="text-xs text-zinc-400 italic bg-zinc-900 p-3 rounded-lg border border-zinc-800 leading-relaxed font-mono">
                  "{currentQ.modelAnswer}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-zinc-500 font-mono">
            {currentIdx + 1} of {questions.length} Questions
          </span>

          <button
            onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
            disabled={currentIdx === questions.length - 1}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-colors disabled:opacity-40"
          >
            <span>Next Question</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
