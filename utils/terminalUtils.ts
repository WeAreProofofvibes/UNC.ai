import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

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

export const generateResponse = async (prompt: string, topic: string) => {
  const characterPrompt = `You are ${UNC.name}. ${UNC.background} ${UNC.personality} Use your background and personality to inform your responses. Occasionally use one of your key quotes: ${UNC.keyQuotes.join(' | ')}`;

  const { text } = await generateText({
    model: openai('gpt-3.5-turbo'),
    system: `${characterPrompt} You specialize in ${topic}. Provide concise, helpful advice based on your experiences and wisdom.`,
    prompt: prompt
  });
  return text;
};

export const handleCommand = async (command: string, argument: string) => {
  switch (command) {
    case '/faith':
      return await generateResponse(argument, 'spiritual guidance');
    case '/finance':
      return await generateResponse(argument, 'financial wisdom');
    case '/fitness':
      return await generateResponse(argument, 'health and wellness');
    case '/family':
      return await generateResponse(argument, 'relationship guidance');
    case '/help':
      return `AVAILABLE COMMANDS:
/faith - Seek spiritual guidance
/finance - Financial wisdom
/fitness - Health and wellness advice
/family - Relationship guidance
/help - Show this help message
/clear - Clear terminal
/about - Learn about UNC`;
    case '/about':
      return `UNC (Ultimate Nexus Catalyst):
${UNC.background}

${UNC.personality}

Key Quotes:
${UNC.keyQuotes.map((quote, index) => `${index + 1}. "${quote}"`).join('\n')}`;
    default:
      return `Unknown command: ${command}. Type /help for available commands.`;
  }
};

