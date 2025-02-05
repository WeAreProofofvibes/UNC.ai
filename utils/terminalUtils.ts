import Groq from "groq-sdk";

// Type definitions
interface Character {
  name: string;
  background: string;
  personality: string;
  keyQuotes: string[];
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

// Character definition
const UNC: Character = {
  name: "UNC (Ultimate Nexus Catalyst)",
  background: `Born and raised in inner-city Philadelphia, UNC overcame challenges through faith, mentorship, and self-discipline. He became a successful real estate developer, cryptocurrency investor, and business operator. UNC is a family man, active church member, and community leader known for his generosity and wisdom.`,
  personality: `UNC balances tough love with compassion. He's a natural storyteller who uses personal experiences to teach valuable lessons. His faith is central to his worldview, and he believes success should uplift others. UNC often uses humor to relate, with phrases like "Back in my day, we didn't have this fancy AI—just grit and prayer!"`,
  keyQuotes: [
    "Every setback is just a setup for a comeback. The only question is: What's your next move?",
    "Money's good, but legacy is better. Let's build something that matters.",
    "Faith without works is dead, and so is a dream without a plan. Let's map it out."
  ]
};

// Initialize Groq client with error handling
const createGroqClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set in environment variables');
  }
  return new Groq({ apiKey });
};

const groq = createGroqClient();

export const generateResponse = async (prompt: string, topic: string): Promise<string> => {
  const characterPrompt = `You are ${UNC.name}. ${UNC.background} ${UNC.personality} Use your key quotes when appropriate: ${UNC.keyQuotes.join(' | ')}`;
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${characterPrompt} You specialize in ${topic}. Provide concise, helpful advice based on your experiences and wisdom.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const content = chatCompletion?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received from Groq');
    }

    return content;
  } catch (error: unknown) {
    console.error('Groq API error:', {
      error: error instanceof Error ? error.message : String(error),
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY ? 'Present' : 'Missing'
    });
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key configuration');
      }
      throw new Error(`Groq API error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const handleCommand = async (command: string, args: string): Promise<string> => {
  const commands = {
    '/faith': 'spiritual guidance',
    '/finances': 'financial wisdom',
    '/fitness': 'health and wellness',
    '/family': 'relationship guidance'
  } as const;

  type CommandKey = keyof typeof commands;

  if (command === '/help') {
    return `Available Commands:
/faith [question] - Seek spiritual guidance
/finances [question] - Get financial wisdom
/fitness [question] - Health and wellness advice
/family [question] - Relationship guidance
/help - Show this help message
/clear - Clear terminal
/about - Learn about UNC`;
  }

  if (command === '/about') {
    return `UNC (Ultimate Nexus Catalyst):
${UNC.background}

${UNC.personality}

Key Quotes:
${UNC.keyQuotes.map((quote, index) => `${index + 1}. "${quote}"`).join('\n')}`;
  }

  if (command in commands) {
    return await generateResponse(args, commands[command as CommandKey]);
  }

  return `Unknown command: ${command}. Type /help for available commands.`;
};

