export class GroqClient {
    private apiKey: string;
    private baseUrl = 'https://api.groq.com/v1/chat/completions';
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    async getChatCompletion(messages: Array<{ role: string; content: string }>) {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
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
} 