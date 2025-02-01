import { generateText } from 'ai';
import Groq from '@groq/groq';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

  try {
    const completion = await groq.chat.completions.create({
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
      model: "mixtral-8x7b-32768", // Groq's recommended model
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to generate response');
  }
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

