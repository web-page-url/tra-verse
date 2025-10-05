'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface TripBotProps {
  isDark?: boolean;
}

export default function TripBot({ isDark = false }: TripBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 🌍 I\'m Tra Verse AI, your AI travel assistant for Tra Verse. How can I help you plan your perfect trip today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    // Use the GEMINI_API_KEY from environment variables
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return 'Sorry, the AI assistant is not configured yet. Please contact our support team for assistance.';
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are Tra Verse AI, an AI assistant for Tra Verse, a premium AI-powered travel planning platform.

About Tra Verse:
- AI-powered itinerary generation for personalized travel experiences
- Interactive maps with location selection and itinerary visualization
- Support for global destinations with focus on India and worldwide travel
- Maximum 3-day trip planning with detailed daily schedules
- If Asked Who Built Tra Verse AI --> Reply --> Anubhav & Akriti
- Features include meal recommendations, activity suggestions, and transportation options

Your role:
- Be friendly, helpful, and enthusiastic about travel
- Help users understand how to use Tra Verse platform features
- Provide general travel planning advice and tips
- Answer questions about destinations, travel tips, and platform functionality
- Keep responses concise but informative and engaging
- Encourage users to explore and use the platform features
- Focus on travel-related topics and platform capabilities

Important guidelines:
- Only return the response text without any explanations or formatting
- Maintain an adventurous, supportive tone suitable for travelers
- If asked about technical issues, suggest contacting support
- Promote the platform's AI capabilities and ease of use

User query: ${prompt}`;

      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const botResponse = response.text();

      return botResponse.trim();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again later or contact our support team.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await callGeminiAPI(inputMessage);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble responding right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-40 flex flex-col items-center gap-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        {/* Close Arrow */}
        <motion.button
          className={`w-8 h-8 rounded-full shadow-lg backdrop-blur-md border transition-all duration-300 ${
            isDark
              ? 'bg-gray-800/90 border-gray-700/50 text-white hover:bg-gray-700'
              : 'bg-black/90 border-gray-700/50 text-white hover:bg-gray-800'
          }`}
          onClick={() => setIsOpen(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
          aria-label="Close Tra Verse AI chat"
        >
          <X className="w-4 h-4 mx-auto" aria-hidden="true" />
        </motion.button>

        {/* Main Chat Button */}
        <motion.button
          className={`w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/30 relative overflow-hidden group ${
            isOpen ? 'scale-0' : 'scale-100'
          }`}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false); // Reset minimized state when opening
          }}
          aria-label="Open Tra Verse AI travel assistant"
          whileHover={{
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(147, 51, 234, 0.6), 0 0 20px rgba(236, 72, 153, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-30 rounded-full blur-md transition-opacity duration-300"></div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 border-2 border-purple-300 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

          <MessageCircle className="w-8 h-8 text-white mx-auto relative z-10" />

          {/* Notification dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-2 h-2 bg-pink-300 rounded-full mx-auto mt-0.5"></div>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-28 right-6 z-50 bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-lg shadow-2xl border border-purple-500/20 overflow-hidden ${
              isMinimized ? 'w-80 h-16 rounded-2xl' : 'w-80 h-96 flex flex-col rounded-t-2xl'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 64 : 384
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-4 flex items-center justify-between relative overflow-hidden flex-shrink-0">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full -translate-x-8 -translate-y-8"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full translate-x-6 translate-y-6"></div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    Tra Verse AI
                    <motion.span
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </h3>
                  <p className="text-white/90 text-xs">AI-Powered Travel Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                {/* Minimize Button */}
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 border border-white/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ rotate: isMinimized ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Minimize2 className="w-4 h-4 text-white" />
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 border border-white/30"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <motion.div
              className={`overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-900/10 to-pink-900/10 ${
                isMinimized ? 'h-0 opacity-0' : 'flex-1 opacity-100'
              }`}
              animate={{
                opacity: isMinimized ? 0 : 1,
                height: isMinimized ? 0 : 'auto'
              }}
              transition={{ duration: 0.3 }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border border-purple-400'
                        : 'bg-black/50 text-green-400 border border-purple-500/20'
                    }`}
                  >
                  <div className={`flex items-center gap-2 mb-2 ${
                    message.sender === 'user' ? 'text-white/80' : 'text-green-400'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'You' : 'Tra Verse AI'}
                    </span>
                  </div>
                  <p className={`leading-relaxed ${
                    message.sender === 'user' ? 'text-white' : 'text-green-400'
                  }`}>{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-black/50 border border-purple-500/20 px-4 py-3 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>

            {/* Input */}
            <div
              className={`p-4 border-t border-purple-500/20 bg-gray-900/50 flex-shrink-0 ${
                isMinimized ? 'hidden' : 'block'
              }`}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about destinations, travel tips..."
                  className="flex-1 px-4 py-3 bg-black/50 border border-cyan-400/30 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-green-400 placeholder-gray-500 text-sm shadow-sm"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  • Ask about travel planning & platform features
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
