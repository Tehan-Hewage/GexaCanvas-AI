import { InferenceClient } from '@huggingface/inference';
import { ENV as env } from '../config/env.js';

let client;

const getClient = () => {
  if (!client) {
    if (!env.HF_TOKEN) {
      throw new Error('HF_TOKEN is not configured');
    }
    client = new InferenceClient(env.HF_TOKEN);
  }
  return client;
};

/**
 * Generate an image from a text prompt using Hugging Face Inference API.
 * @param {string} prompt - The image generation prompt
 * @returns {Object} { buffer, contentType }
 */
export const generateHuggingFaceImage = async (prompt) => {
  try {
    const hf = getClient();

    const result = await hf.textToImage({
      model: env.HF_IMAGE_MODEL,
      inputs: prompt,
    });

    // result is a Blob
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = result.type || 'image/png';

    return { buffer, contentType };
  } catch (error) {
    console.error('Hugging Face service error:', error.message);

    if (error.message.includes('token') || error.message.includes('401')) {
      throw new Error('Hugging Face token is invalid or not configured. Please check your HF_TOKEN.');
    }

    if (error.message.includes('Model') || error.message.includes('404')) {
      throw new Error(`Image model "${env.HF_IMAGE_MODEL}" is not available. Try a different model.`);
    }

    throw new Error(
      'Image generation is temporarily unavailable. Check your Hugging Face token, model, or provider availability.'
    );
  }
};
