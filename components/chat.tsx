// lib/groq-integration.ts

// Environment configuration
interface EnvConfig {
    groqApiKey: string;
  }
  
  export function getConfig(): EnvConfig {
    if (typeof window !== 'undefined') {
      if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
        throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set in environment variables');
      }
      return {
        groqApiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
      };
    }
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    return {
      groqApiKey: process.env.GROQ_API_KEY
    };
  }
  
  // Groq client interface and implementation
  export interface GroqClient {
    apiKey: string;
    baseUrl: string;
    getChatCompletion(messages: Array<{ role: string; content: string }>): Promise<string>;
  }
  
  export const createGroqClient = (apiKey: string): GroqClient => {
    const baseUrl = 'https://api.groq.com/v1/chat/completions';
    
    return {
      apiKey,
      baseUrl,
      async getChatCompletion(messages: Array<{ role: string; content: string }>) {
        try {
          const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'mixtral-8x7b-32768',
              messages,
              temperature: 0.7,
            }),
          });
    
          if (!response.ok) {
            throw new Error(`Groq API error: ${response.statusText}`);
          }
    
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (error) {
          console.error('Error calling Groq API:', error);
          throw error;
        }
      }
    };
  };
  
  // Command handlers
  interface CommandHandlers {
    [key: string]: (args: string) => Promise<string>;
  }
  
  const createCommandHandlers = (groqClient: GroqClient): CommandHandlers => ({
    '/help': async () => `
  Available commands:
  /clear - Clear the terminal
  /faith [question] - Ask about faith and spirituality
  /finances [question] - Ask about financial advice
  /fitness [question] - Ask about health and fitness
  /family [question] - Ask about family matters
    `.trim(),
  
    '/clear': async () => '',
  
    '/faith': async (args) => {
      const messages = [
        { role: 'system', content: 'You are UNC, a wise spiritual guide who speaks in an encouraging, motivational tone with references to faith and spirituality. Keep responses concise and impactful.' },
        { role: 'user', content: args }
      ];
      return await groqClient.getChatCompletion(messages);
    },
  
    '/finances': async (args) => {
      const messages = [
        { role: 'system', content: 'You are UNC, a financial advisor who provides practical money management advice with a focus on building wealth and financial independence. Keep responses concise and actionable.' },
        { role: 'user', content: args }
      ];
      return await groqClient.getChatCompletion(messages);
    },
  
    '/fitness': async (args) => {
      const messages = [
        { role: 'system', content: 'You are UNC, a fitness coach who provides practical health and wellness advice. Focus on sustainable habits and holistic well-being. Keep responses concise and motivating.' },
        { role: 'user', content: args }
      ];
      return await groqClient.getChatCompletion(messages);
    },
  
    '/family': async (args) => {
      const messages = [
        { role: 'system', content: 'You are UNC, a family counselor who provides guidance on relationships and family dynamics. Focus on building strong bonds and healthy communication. Keep responses concise and compassionate.' },
        { role: 'user', content: args }
      ];
      return await groqClient.getChatCompletion(messages);
    },
  });
  
  // Terminal handler factory
  export const createTerminalHandler = () => {
    const groqClient = createGroqClient(getConfig().groqApiKey);
    const commandHandlers = createCommandHandlers(groqClient);
  
    return async function handleCommand(command: string, args: string): Promise<string> {
      const handler = commandHandlers[command.toLowerCase()];
      
      if (!handler) {
        return `Unknown command: ${command}. Type /help for available commands.`;
      }
  
      try {
        return await handler(args);
      } catch (error) {
        console.error('Error handling command:', error);
        return 'An error occurred while processing your request. Please try again.';
      }
    };
  };