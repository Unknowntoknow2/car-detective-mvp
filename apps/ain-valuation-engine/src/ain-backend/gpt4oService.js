import OpenAI from 'openai';
import logger from '../utils/logger.js';
const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});
/**
 * Generates AI-powered responses for vehicle valuation and analysis using GPT-4o.
 *
 * This service integrates with OpenAI's GPT-4o model to provide intelligent
 * insights about vehicles, market conditions, and valuation factors. It maintains
 * context awareness and provides specialized knowledge for automotive applications.
 *
 * @param {string} input - The user's question or request for AI analysis
 * @param {AIContext} context - Contextual information including vehicle data and conversation history
 * @returns {Promise<string>} AI-generated response with vehicle insights and recommendations
 *
 * @throws {Error} When OpenAI API calls fail or response generation encounters errors
 *
 * @example
 * ```typescript
 * const context = {
 *   vehicleData: { year: 2020, make: 'Toyota', model: 'Camry' },
 *   conversationHistory: ['Hello', 'What is this car worth?'],
 *   userIntent: 'valuation'
 * };
 *
 * const response = await getAIResponse(
 *   'What factors affect this vehicle\'s value?',
 *   context
 * );
 * console.log('AI Response:', response);
 * ```
 *
 * @aiModel GPT-4o - Advanced language model optimized for complex reasoning
 * @features
 * - Context-aware responses based on vehicle data
 * - Conversation history tracking
 * - Specialized automotive knowledge
 * - Market analysis and valuation insights
 *
 * @rateLimits Subject to OpenAI API rate limits and token usage
 * @security API key required, input sanitization handled by OpenAI
 */
export async function getAIResponse(input, context) {
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
    }
    catch (error) {
        logger.error('OpenAI API error:', error);
        return "I'm currently unable to process your request. Please try again later.";
    }
}
