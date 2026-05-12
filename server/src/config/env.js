import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_IMAGE_BUCKET: process.env.SUPABASE_IMAGE_BUCKET || 'gexacanvas-images',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  GEMINI_IMAGE_MODEL: process.env.GEMINI_IMAGE_MODEL || 'nano-banana-pro-preview',
  HF_TOKEN: process.env.HF_TOKEN,
  HF_IMAGE_MODEL: process.env.HF_IMAGE_MODEL || 'black-forest-labs/FLUX.1-schnell',
};

const requiredKeys = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
];

for (const key of requiredKeys) {
  if (!ENV[key]) {
    console.warn(`[WARNING] Missing required environment variable: ${key}`);
  }
}
