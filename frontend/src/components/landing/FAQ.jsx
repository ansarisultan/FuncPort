import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: "What is FuncPort?",
    answer: "FuncPort (formerly FuncLexa) is a premium network engineering and API simulation platform. It allows developers to create mock proxies, simulate network latency, inspect traffic, execute stress tests, and test backend API responses under controlled degradation."
  },
  {
    question: "How does the Network Latency simulator work?",
    answer: "When you route your frontend requests through the generated proxy URL, our backend applies configured network profile conditions (such as 3G, LTE, slow edge, or custom timeouts) to the request before forwarding it, allowing you to debug race conditions and UX lag."
  },
  {
    question: "Can I run load/stress tests?",
    answer: "Yes. Our Stress Test dashboard lets you configure concurrent requests, test duration, and routes to run high-load simulations, plotting latency charts and success/failure logs in real-time."
  },
  {
    question: "What are Schema Mutations?",
    answer: "Schema mutations let you simulate payload alterations—like dropping fields, changing types, or returning null values—to test the resilience of your frontend state management and guard against unexpected API contracts."
  },
  {
    question: "Is it secure to proxy production URLs?",
    answer: "We recommend using FuncPort for development, staging, and sandboxed testing. All proxy statistics are stored securely in your workspace instance, and payload data can be reset or cleared instantly."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 bg-[#050814]/70">
      <div className="mx-auto max-w-4xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about setting up proxies, managing scenarios, and testing API resilience.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex items-center justify-between p-6 text-left text-white hover:bg-white/5 transition"
              >
                <span className="font-semibold text-sm md:text-base">{item.question}</span>
                <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-300 ${
                  openIndex === idx ? 'rotate-180' : ''
                }`} />
              </button>
              
              <div className={`transition-all duration-300 ${
                openIndex === idx ? 'max-h-96 opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                <p className="p-6 text-sm text-slate-400 leading-relaxed bg-[#0A1020]/25">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
