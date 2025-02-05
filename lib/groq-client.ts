import axios, { AxiosResponse } from 'axios';

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string; // Optional name field
}

interface GroqApiResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

// Environment configuration
export function getConfig() {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set in environment variables');
  }
  return { apiKey };
}

export class GroqClient {
  private readonly apiKey: string;
  private readonly baseURL = 'https://api.groq.com/openai/v1';  // Changed from v1 to openai/v1

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not set in environment variables');
    }
    this.apiKey = apiKey;
  }

  async getChatCompletion(messages: Message[]): Promise<string> {
    // Additional input validation
    if (!messages || messages.length === 0) {
      throw new Error('Messages array cannot be empty');
    }

    try {
      const response: AxiosResponse<GroqApiResponse> = await axios.post(
        `${this.baseURL}/chat/completions`,  // This will now be /openai/v1/chat/completions
        {
          messages,
          model: "mixtral-8x7b-32768",
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Invalid response format from Groq API');
      }

      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your credentials.');
        }
        if (error.response?.status === 404) {
          throw new Error('Invalid API endpoint or model not found.');
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Groq API error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw new Error(`Groq API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Export a default client instance
export const createGroqClient = () => new GroqClient(getConfig().apiKey);