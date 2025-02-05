import { GroqClient } from '@/lib/groq-client';

async function testGroqConnection() {
  console.log('🔍 Testing Groq API connection...');
  
  // Check if API key is set
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    console.error('❌ API key is not set in environment variables');
    return false;
  }
  console.log('✅ API key is present');

  // Initialize client
  const groqClient = new GroqClient(apiKey);
  
  try {
    // Simple test message
    const messages = [
      { role: 'user', content: 'Hello, this is a test message. Please respond with "Test successful!"' }
    ];

    console.log('📡 Sending test request to Groq API...');
    const response = await groqClient.getChatCompletion(messages);
    
    console.log('📥 Received response:', response);
    console.log('✅ API connection test successful!');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
}

// You can run this test directly
testGroqConnection().then(success => {
  if (success) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('❌ Some tests failed');
  }
});

export { testGroqConnection }; 