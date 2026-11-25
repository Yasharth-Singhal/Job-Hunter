import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Terminal 
} from 'lucide-react';
import { Job } from '../types';

interface CodingSandboxModalProps {
  job: Job | null;
  onClose: () => void;
}

interface DsaProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
  description: string;
  starterCodeJS: string;
  testCases: Array<{ input: string; expected: string }>;
}

const SAMPLE_PROBLEMS: DsaProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum (Target Array Indices)',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Google', 'Microsoft', 'TCS'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
    starterCodeJS: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: 'twoSum([2, 7, 11, 15], 9)', expected: '[0, 1]' },
      { input: 'twoSum([3, 2, 4], 6)', expected: '[1, 2]' }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses & Bracket Matching',
    difficulty: 'Easy',
    companyTags: ['Google', 'Microsoft', 'Stripe'],
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    starterCodeJS: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: 'isValid("()[]{}")', expected: 'true' },
      { input: 'isValid("(]")', expected: 'false' }
    ]
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache Design (Get & Put)',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Stripe', 'Google'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put.',
    starterCodeJS: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, val) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, val);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}`,
    testCases: [
      { input: 'const l = new LRUCache(2); l.put(1, 1); l.put(2, 2); l.get(1);', expected: '1' }
    ]
  }
];

export const CodingSandboxModal: React.FC<CodingSandboxModalProps> = ({ job, onClose }) => {
  const [selectedProb, setSelectedProb] = useState<DsaProblem>(SAMPLE_PROBLEMS[0]);
  const [code, setCode] = useState(selectedProb.starterCodeJS);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [testsPassed, setTestsPassed] = useState<boolean | null>(null);

  const handleSelectProblem = (prob: DsaProblem) => {
    setSelectedProb(prob);
    setCode(prob.starterCodeJS);
    setOutputLogs([]);
    setTestsPassed(null);
  };

  const runCode = () => {
    setOutputLogs([]);
    try {
      const logs: string[] = [];
      // Safe client execution for testing
      const fn = new Function(`${code}\nreturn { twoSum: typeof twoSum !== 'undefined' ? twoSum : null, isValid: typeof isValid !== 'undefined' ? isValid : null, LRUCache: typeof LRUCache !== 'undefined' ? LRUCache : null };`);
      const exportsObj = fn();

      let allPassed = true;

      selectedProb.testCases.forEach((tc, idx) => {
        try {
          const evalTest = new Function('exportsObj', `
            const { twoSum, isValid, LRUCache } = exportsObj;
            return JSON.stringify(${tc.input});
          `);
          const res = evalTest(exportsObj);
          const passed = res === tc.expected || (res === 'true' && tc.expected === 'true');
          if (!passed) allPassed = false;

          logs.push(`Test Case ${idx + 1}: ${tc.input} => Result: ${res} [${passed ? 'PASSED ✅' : 'FAILED ❌'}]`);
        } catch (err: any) {
          allPassed = false;
          logs.push(`Test Case ${idx + 1} Error: ${err.message}`);
        }
      });

      setOutputLogs(logs);
      setTestsPassed(allPassed);
    } catch (err: any) {
      setOutputLogs([`Syntax/Execution Error: ${err.message}`]);
      setTestsPassed(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>In-Browser DSA Interview Coding Sandbox</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Live Execution
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Practice verified coding problems frequently asked at {job?.company || 'Top Tech MNCs'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Problem Selector Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/50 border-b border-zinc-800 overflow-x-auto">
          {SAMPLE_PROBLEMS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProblem(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedProb.id === p.id
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{p.title}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                p.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {p.difficulty}
              </span>
            </button>
          ))}
        </div>

        {/* Sandbox Body: Split Problem Description & Code Editor */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {/* Left: Problem Statement & Test Cases */}
          <div className="p-5 overflow-y-auto space-y-4 bg-zinc-950/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase">{selectedProb.difficulty}</span>
                <span className="text-[10px] text-zinc-500 font-mono">• Asked by {selectedProb.companyTags.join(', ')}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedProb.title}</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedProb.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Sample Test Cases:
              </span>
              {selectedProb.testCases.map((tc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs space-y-1">
                  <div className="text-zinc-400">Input: <span className="text-white">{tc.input}</span></div>
                  <div className="text-emerald-400">Expected: {tc.expected}</div>
                </div>
              ))}
            </div>

            {/* Test Case Execution Output */}
            {outputLogs.length > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold uppercase">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Execution Console
                  </span>
                  <span className={testsPassed ? 'text-emerald-400' : 'text-red-400'}>
                    {testsPassed ? 'All Passed ✅' : 'Tests Failed ❌'}
                  </span>
                </div>
                {outputLogs.map((log, i) => (
                  <div key={i} className="text-zinc-300 text-[11px]">{log}</div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Code Editor & Run Action */}
          <div className="p-4 flex flex-col justify-between space-y-3 bg-zinc-950">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono">JavaScript / Node.js Engine</span>
              <button
                onClick={() => setCode(selectedProb.starterCodeJS)}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="flex-1 w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none shadow-inner"
              spellCheck={false}
            />

            <button
              onClick={runCode}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Run Code & Verify Test Cases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
