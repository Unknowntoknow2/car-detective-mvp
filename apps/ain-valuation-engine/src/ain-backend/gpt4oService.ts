import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export async function getAIResponse(input: string, context: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping with vehicle valuation and analysis. Provide helpful, accurate information."
        },
        {
          role: "user",
          content: `${input}\n\nContext: ${JSON.stringify(context)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm currently unable to process your request. Please try again later.";
  }
}
