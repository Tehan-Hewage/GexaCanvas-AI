import { GoogleGenAI } from '@google/genai';
import { ENV as env } from '../config/env.js';

const SYSTEM_PROMPT = `You are GexaCanvas AI, a helpful AI assistant inside a creative chat and image-generation workspace. Be clear, practical, and friendly. Use markdown formatting for headings, bullet points, tables, and code blocks when helpful. Keep answers useful and not overly verbose unless the user asks for depth.`;

let ai;

const getClient = () => {
  if (!ai) {
    if (!env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return ai;
};

/**
 * Generate a text response from Gemini.
 * @param {Array} conversationHistory - Array of { role, content } messages (max latest 20)
 * @param {string} userMessage - The current user message
 * @returns {string} The assistant's response text
 */
export const generateGeminiResponse = async (conversationHistory, userMessage) => {
  try {
    const client = getClient();

    // Build conversation context from history (latest 20 messages)
    const recentHistory = conversationHistory.slice(-20);

    let contextPrompt = `${SYSTEM_PROMPT}\n\n`;

    if (recentHistory.length > 0) {
      contextPrompt += '--- Conversation History ---\n';
      for (const msg of recentHistory) {
        const label = msg.role === 'user' ? 'User' : 'Assistant';
        contextPrompt += `${label}: ${msg.content}\n`;
      }
      contextPrompt += '--- End History ---\n\n';
    }

    contextPrompt += `User: ${userMessage}\n\nAssistant:`;

    const response = await client.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: contextPrompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    return text;
  } catch (error) {
    console.error('Gemini service error:', error.message);

    if (error.message.includes('API_KEY')) {
      throw new Error('Gemini API key is invalid or not configured. Please check your GEMINI_API_KEY.');
    }

    if (error.message.includes('quota') || error.message.includes('rate')) {
      throw new Error('Gemini API rate limit reached. Please try again in a moment.');
    }

    throw new Error(`AI response failed: ${error.message}`);
  }
};

/**
 * Generate an image from a text prompt using Google Gemini (Imagen).
 * @param {string} prompt - The image generation prompt
 * @returns {Object} { buffer, contentType }
 */
export const generateGeminiImage = async (prompt) => {
  try {
    const client = getClient();

    const response = await client.models.generateImages({
      model: env.GEMINI_IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
      }
    });

    const base64Image = response.generatedImages[0].image.imageBytes;
    const buffer = Buffer.from(base64Image, 'base64');
    const contentType = 'image/png';

    return { buffer, contentType };
  } catch (error) {
    console.error('Gemini Image service error:', error.message);

    if (error.message.includes('API_KEY')) {
      throw new Error('Gemini API key is invalid or not configured. Please check your GEMINI_API_KEY.');
    }

    throw new Error(`Image generation failed: ${error.message}`);
  }
};
