import { GroqClient } from './groq-client';

// Environment configuration
const getConfig = () => {
  if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set in environment variables');
  }
  return {
    groqApiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
  };
};

// Initialize Groq client
const groqClient = new GroqClient(getConfig().groqApiKey);

interface Character {
  name: string;
  background: string;
  personality: string;
  keyQuotes: string[];
}

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

async function generateResponse(topic: string, prompt: string): Promise<string> {
  const characterPrompt = `You are ${UNC.name}. ${UNC.background} ${UNC.personality} Use your background and personality to inform your responses. Occasionally use one of your key quotes: ${UNC.keyQuotes.join(' | ')}. You specialize in ${topic}. Provide concise, helpful advice based on your experiences and wisdom.`;
  
  try {
    const messages = [
      { role: 'system', content: characterPrompt },
      { role: 'user', content: prompt }
    ];

    return await groqClient.getChatCompletion(messages);
  } catch (error) {
    console.error('Error generating response:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
}

export async function handleCommand(command: string, args: string): Promise<string> {
  switch (command.toLowerCase()) {
    case '/help':
      return `
Available commands:
/clear - Clear the terminal
/faith [question] - Ask about faith and spirituality
/finances [question] - Ask about financial advice
/fitness [question] - Ask about health and fitness
/family [question] - Ask about family matters
/about - Learn about UNC
      `.trim();

    case '/clear':
      return '';

    case '/faith':
      return await generateResponse('spiritual guidance', args);

    case '/finances':
      return await generateResponse('financial wisdom', args);

    case '/fitness':
      return await generateResponse('health and wellness', args);

    case '/family':
      return await generateResponse('relationship guidance', args);

    case '/about':
      return `UNC (Ultimate Nexus Catalyst):
${UNC.background}

${UNC.personality}

Key Quotes:
${UNC.keyQuotes.map((quote, index) => `${index + 1}. "${quote}"`).join('\n')}`;

    default:
      return `Unknown command: ${command}. Type /help for available commands.`;
  }
}

