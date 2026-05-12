import { supabaseAdmin } from '../config/supabase.js';
import { ENV } from '../config/env.js';
import crypto from 'crypto';

export const uploadGeneratedImage = async ({ userId, chatId, buffer, contentType = 'image/png' }) => {
  const bucketName = ENV.SUPABASE_IMAGE_BUCKET;
  
  // Provide a generic fallback if no chatId is available
  const chatDir = chatId || 'unassigned';
  const fileName = `${Date.now()}-${crypto.randomUUID()}.png`;
  const filePath = `${userId}/${chatDir}/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return {
    imagePath: filePath,
    imageUrl: publicUrlData.publicUrl
  };
};

export const getPublicImageUrl = (path) => {
  const { data } = supabaseAdmin.storage
    .from(ENV.SUPABASE_IMAGE_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
};
