'use client'

import React, { useState, useEffect, useRef } from 'react';
import { handleCommand } from '@/lib/terminal-utils';
import { MatrixBackground } from './matrix-background';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Message {
  type: 'system' | 'unc' | 'user';
  content: string;
}

export const TerminalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', content: 'UNC.AI TERMINAL v2.0.0' },
    { type: 'system', content: 'ESTABLISHING SECURE CONNECTION...' },
    { type: 'system', content: 'CONNECTION ESTABLISHED WITH UNC (Ultimate Nexus Catalyst)' },
    { type: 'unc', content: 'Peace, young blood. I\'m UNC, your guide on this journey through life. What you need? Remember, every setback is just a setup for a comeback. The only question is: What\'s your next move?' }
  ]);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = { type: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);

    if (input.toLowerCase() === '/clear') {
      setMessages([]);
    } else {
      setMessages(prev => [...prev, { type: 'system', content: 'UNC IS COOKING...' }]);

      let response: string;
      if (input.startsWith('/')) {
        const [command, ...args] = input.split(' ');
        response = await handleCommand(command, args.join(' '));
      } else {
        response = await handleCommand('/faith', input);
      }

      setMessages(prev => [
        ...prev.filter(msg => msg.content !== 'UNC IS COOKING...'),
        { type: 'unc', content: response }
      ]);
    }

    setInput('');
  };

  return (
    <div className="terminal-container">
      <MatrixBackground />
      <div className="terminal-window">
        <div className="min-h-[80vh] max-h-[80vh] bg-transparent text-green-500 font-mono p-4">
          <div className="mb-8 border border-green-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <h1 className="text-2xl">unc.fun</h1>
                <div className="flex space-x-4 ml-4">
                  <a href="https://x.com/uncdotfun" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter text-green-500"></i>
                  </a>
                  <a href="https://t.me/uncdotfun" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-telegram text-green-500"></i>
                  </a>
                </div>
              </div>
              <a href="https://pump.fun/coin/3NmdPK8TfVW91VNpJ89jXsUkVxTzgLc2wyguqMSwGF8R?coins_sort=market_cap" target="_blank" rel="noopener noreferrer">
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  BUY NOW
                </button>
              </a>
            </div>
            <div className="flex justify-between items-center">
              <p className="opacity-70">
                FAITH | FINANCES | FITNESS | FAMILY
              </p>
            </div>
          </div>

          <div className="mb-8 h-[50vh] overflow-y-auto border border-green-500 p-4">
            {messages.map((message, index) => (
              <div key={index} className="mb-4">
                {message.type === 'system' && (
                  <div className="opacity-50">
                    {'>'} {message.content}
                  </div>
                )}
                {message.type === 'unc' && (
                  <div>
                    <span className="text-yellow-500">UNC{'>'}</span> {message.content}
                  </div>
                )}
                {message.type === 'user' && (
                  <div>
                    <span className="text-blue-500">YNS{'>'}</span> {message.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border border-green-500 p-4">
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-green-500 mr-2">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-green-500 outline-none"
                placeholder="Type your message or command (Press Enter to send)"
              />
            </form>
          </div>

          <div className="mt-4 text-sm opacity-70">
            <p>Type /help for available commands</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalChat;

