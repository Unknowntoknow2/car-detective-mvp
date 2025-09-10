import OpenAI from 'openai';
import logger from '../utils/logger.js';
const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});
export async function analyzeImage(imageBuffer) {
    try {
        // Convert buffer to base64
        const base64Image = imageBuffer.toString('base64');
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this vehicle image and provide insights about its condition, visible damage, features, and estimated market impact on valuation."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });
        return response.choices[0]?.message?.content || "Unable to analyze image.";
    }
    catch (error) {
        logger.error('Vision API error:', error);
        return "Image analysis temporarily unavailable. Please try again later.";
    }
}
