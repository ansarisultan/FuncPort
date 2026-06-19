import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useStore } from '../store/useStore';

const AIContext = createContext(null);

const SYSTEM_PROMPT = `You are mock.funclexa AI Assistant, an intelligent helper for the Network Environment Playground.
You help developers test their applications against controlled backend conditions.

You have access to:
- The user's current proxy configuration
- Network conditions (latency, errors, failure rates)
- Traffic logs and statistics
- Saved scenarios

Your capabilities:
1. Help configure proxy URLs and backend connections
2. Guide users on network condition simulation
3. Explain error injection and failure rates
4. Assist with stress testing and load simulation
5. Help create and manage scenarios
6. Troubleshoot connection issues
7. Explain schema mutation and payload expansion

Always be helpful, professional, and concise. Provide actionable advice.`;

export function AIProvider({ children }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const { backendUrl, proxyUrl, isProxyActive, latency, errorCode, failureRate, trafficLogs } = useStore();

  const buildContext = useCallback(() => {
    return `
Current Configuration:
- Backend URL: ${backendUrl || 'Not set'}
- Proxy URL: ${proxyUrl || 'Not generated'}
- Proxy Status: ${isProxyActive ? 'Active' : 'Inactive'}
- Latency: ${latency}ms
- Error Code: ${errorCode === 'none' ? 'None' : errorCode}
- Failure Rate: ${failureRate}%
- Total Traffic Logs: ${trafficLogs.length}
`;
  }, [backendUrl, proxyUrl, isProxyActive, latency, errorCode, failureRate, trafficLogs]);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      const errorMsg = 'Groq API key not configured. Please add VITE_GROQ_API_KEY to your environment variables.';
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setError(null);

    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);

    const context = buildContext();
    const systemPrompt = SYSTEM_PROMPT + context;

    try {
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10),
        userMsg,
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'I apologize, but I could not process your request.';

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      try {
        localStorage.setItem('mock_funclexa_chat_history', JSON.stringify(
          [...messages, userMsg, { role: 'assistant', content: assistantMessage }].slice(-50)
        ));
      } catch (e) {}

    } catch (error) {
      if (error.name === 'AbortError') return;
      setError(error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}` 
      }]);
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [messages, buildContext]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('mock_funclexa_chat_history');
  }, []);

  const loadHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem('mock_funclexa_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      }
    } catch (e) {}
  }, []);

  const quickActions = {
    'generate proxy': 'Enter your backend URL in the Configuration panel and click "Generate Proxy" to create your mock URL.',
    'simulate latency': 'Use the Network Controls panel to add latency. Choose from presets or set custom values.',
    'inject errors': 'Select an error code from the Error Injection section to simulate backend failures.',
    'stress test': 'Enable stress testing in the Advanced section to simulate high load conditions.',
    'create scenario': 'Configure your network conditions and click "Save Current" to create a reusable scenario.',
    'help': 'I can help with:\n• Proxy configuration\n• Network condition simulation\n• Error injection\n• Stress testing\n• Scenario management\n• Traffic inspection\n\nWhat would you like to know?',
  };

  return (
    <AIContext.Provider value={{
      messages,
      isProcessing,
      error,
      sendMessage,
      clearHistory,
      loadHistory,
      quickActions,
      buildContext,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
