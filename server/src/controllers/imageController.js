import { supabaseAdmin } from '../config/supabase.js';
import { ENV } from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import sanitizeTitle from '../utils/sanitizeTitle.js';
import { generatePollinationsImage } from '../services/pollinationsService.js';
import { uploadGeneratedImage } from '../services/storageService.js';

/**
 * @route   POST /api/images/generate
 * @desc    Generate image from prompt and save to Supabase
 * @access  Protected
 */
export const generateImage = asyncHandler(async (req, res) => {
  const { chatId, prompt } = req.body;
  const userId = req.user.id;

  if (!prompt || !prompt.trim()) {
    res.status(400);
    throw new Error('Please enter an image prompt');
  }

  let chat;

  // 1. Resolve chat
  if (chatId) {
    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('id, mode, title')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      res.status(404);
      throw new Error('Chat not found');
    }
    chat = data;
  } else {
    // Create new image chat
    const { data, error } = await supabaseAdmin
      .from('chats')
      .insert({
        user_id: userId,
        title: sanitizeTitle(prompt),
        mode: 'image',
        pinned: false
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    chat = data;
  }

  // 2. Insert user prompt message
  const { data: userMessage, error: userMsgError } = await supabaseAdmin
    .from('messages')
    .insert({
      chat_id: chat.id,
      user_id: userId,
      role: 'user',
      type: 'text',
      content: prompt.trim(),
      prompt: prompt.trim()
    })
    .select()
    .single();

  if (userMsgError) throw new Error(userMsgError.message);

  // 3. Generate image using Pollinations (Free, unauthenticated fallback)
  let imageBuffer, contentType;
  try {
    const result = await generatePollinationsImage(prompt.trim());
    imageBuffer = result.buffer;
    contentType = result.contentType;
  } catch (err) {
    console.error('Image Generation error:', err);
    throw new Error(err.message || 'Image generation is temporarily unavailable.');
  }

  // 4. Upload to Supabase Storage
  const { imagePath, imageUrl } = await uploadGeneratedImage({
    userId,
    chatId: chat.id,
    buffer: imageBuffer,
    contentType
  });

  // 5. Insert generated image record
  const { data: generatedImage, error: genImgError } = await supabaseAdmin
    .from('generated_images')
    .insert({
      user_id: userId,
      chat_id: chat.id,
      prompt: prompt.trim(),
      image_url: imageUrl,
      image_path: imagePath,
      model: 'pollinations-flux',
      provider: 'pollinations'
    })
    .select()
    .single();

  if (genImgError) throw new Error(genImgError.message);

  // 6. Insert assistant image message
  const { data: assistantMessage, error: asstMsgError } = await supabaseAdmin
    .from('messages')
    .insert({
      chat_id: chat.id,
      user_id: userId,
      role: 'assistant',
      type: 'image',
      content: 'Generated image',
      image_url: imageUrl,
      image_path: imagePath,
      prompt: prompt.trim(),
      metadata: {
        generated_image_id: generatedImage.id,
        model: 'pollinations-flux',
        provider: 'pollinations'
      }
    })
    .select()
    .single();

  if (asstMsgError) throw new Error(asstMsgError.message);

  // 7. Update chat
  const newMode = chat.mode === 'chat' ? 'mixed' : chat.mode;
  const { data: updatedChat, error: updateError } = await supabaseAdmin
    .from('chats')
    .update({ 
      mode: newMode,
      last_message_at: new Date().toISOString()
    })
    .eq('id', chat.id)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  res.json({
    chat: { ...updatedChat, _id: updatedChat.id },
    userMessage: { ...userMessage, _id: userMessage.id },
    assistantMessage: { ...assistantMessage, _id: assistantMessage.id },
    image: generatedImage
  });
});
