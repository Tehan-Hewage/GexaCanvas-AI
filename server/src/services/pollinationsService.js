import sanitizeTitle from '../utils/sanitizeTitle.js';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Generate an image from a text prompt using Pollinations.ai (Free, no auth required).
 * @param {string} prompt - The image generation prompt
 * @returns {Object} { buffer, contentType }
 */
export const generatePollinationsImage = async (prompt) => {
  let retries = 3;
  let lastError = null;

  while (retries > 0) {
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 10000000);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;

      const response = await fetch(url);

      if (response.status === 429) {
        throw new Error('429');
      }
      
      if (!response.ok) {
        throw new Error(`Pollinations API returned ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      return { buffer, contentType };
    } catch (error) {
      lastError = error;
      if (error.message === '429') {
        retries--;
        if (retries > 0) {
          console.warn(`Pollinations rate limited (429). Retrying in ${4 - retries} seconds...`);
          await delay((4 - retries) * 1000); // 1s, 2s backoff
          continue;
        }
      }
      throw new Error(error.message === '429' ? 'Pollinations API returned 429' : error.message);
    }
  }

  throw new Error(`Image generation failed: ${lastError.message}`);
};
