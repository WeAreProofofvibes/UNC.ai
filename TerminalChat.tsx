'use client'

import React, { useState, useEffect, useRef } from 'react';
import { handleCommand } from './utils/terminalUtils';

interface Message {
  type: 'system' | 'unc' | 'user';
  content: string;
}

const TerminalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', content: 'UNC.AI TERMINAL v2.0.0' },
    { type: 'system', content: 'ESTABLISHING SECURE CONNECTION...' },
    { type: 'system', content: 'CONNECTION ESTABLISHED WITH UNC (Ultimate Nexus Catalyst)' },
    { type: 'unc', content: 'Peace, YN. I\'m UNC, your guide on this journey through life. What wisdom do you seek today? Remember, every setback is just a setup for a comeback. The only question is: What\'s your next move?' }
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
        ...prev.filter(msg => msg.content !== 'UNC IS CONTEMPLATING...'),
        { type: 'unc', content: response }
      ]);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 border border-green-500 p-4">
          <h1 className="text-2xl mb-2">UNC.AI TERMINAL</h1>
          <p className="opacity-70">
            FAITH | FINANCES | FITNESS | FAMILY
          </p>
        </div>

        <div className="mb-8 h-[60vh] overflow-y-auto border border-green-500 p-4">
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
  );
};

export default TerminalChat;

