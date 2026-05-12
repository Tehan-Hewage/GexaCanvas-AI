import { supabaseAdmin } from '../config/supabase.js';
import asyncHandler from '../utils/asyncHandler.js';
import sanitizeTitle from '../utils/sanitizeTitle.js';
import { generateGeminiResponse } from '../services/geminiService.js';

/**
 * @route   GET /api/chats
 * @desc    Get all chats for the current user
 * @access  Protected
 */
export const getChats = asyncHandler(async (req, res) => {
  const { data: chats, error } = await supabaseAdmin
    .from('chats')
    .select('*')
    .eq('user_id', req.user.id)
    .order('pinned', { ascending: false })
    .order('last_message_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Fetch latest messages for preview (efficient approach would be a lateral join in SQL,
  // but for MVP we can just fetch the latest message for each chat or simply return chats)
  // To keep it simple and within the prompt constraints, we'll fetch them separately or omit.
  // Actually, let's fetch the latest message for each chat if there are chats.
  
  const chatIds = chats.map(c => c.id);
  let latestMessages = [];
  
  if (chatIds.length > 0) {
     // A simple way is to just fetch the last message. In a real app we'd use a view.
     // For this MVP, we will omit the preview or just return empty previews, 
     // but the prompt says: "Include a lightweight latest message preview."
     // Let's query messages matching these chat_ids, order by created_at desc, and group in JS.
     const { data: messages, error: msgError } = await supabaseAdmin
       .from('messages')
       .select('id, chat_id, content, role, type, created_at')
       .in('chat_id', chatIds)
       .order('created_at', { ascending: false });
       
     if (!msgError && messages) {
        latestMessages = messages;
     }
  }

  const chatsWithPreview = chats.map((chat) => {
    const lastMsg = latestMessages.find(m => m.chat_id === chat.id);
    return {
      ...chat,
      _id: chat.id, // For compatibility if client expects _id
      lastMessage: lastMsg
        ? {
            content: lastMsg.type === 'image' 
              ? '🖼️ Image generated' 
              : lastMsg.content?.substring(0, 100) || '',
            role: lastMsg.role,
            createdAt: lastMsg.created_at,
          }
        : null,
      messageCount: latestMessages.filter(m => m.chat_id === chat.id).length || 0,
    };
  });

  res.json({ chats: chatsWithPreview });
});

/**
 * @route   POST /api/chats
 * @desc    Create a new chat
 * @access  Protected
 */
export const createChat = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const { data: chat, error } = await supabaseAdmin
    .from('chats')
    .insert({
      user_id: req.user.id,
      title: title || 'New Chat',
      mode: 'chat',
      pinned: false
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  res.status(201).json({ chat: { ...chat, _id: chat.id, messages: [] } });
});

/**
 * @route   GET /api/chats/:id
 * @desc    Get a single chat with full messages
 * @access  Protected
 */
export const getChat = asyncHandler(async (req, res) => {
  const { data: chat, error } = await supabaseAdmin
    .from('chats')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  const { data: messages, error: msgError } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('chat_id', chat.id)
    .order('created_at', { ascending: true });

  if (msgError) throw new Error(msgError.message);

  res.json({ 
    chat: { 
      ...chat, 
      _id: chat.id,
      messages: messages.map(m => ({ ...m, _id: m.id })) 
    } 
  });
});

/**
 * @route   PATCH /api/chats/:id
 * @desc    Update a chat (title, pinned)
 * @access  Protected
 */
export const updateChat = asyncHandler(async (req, res) => {
  const { title, pinned, mode } = req.body;
  
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (pinned !== undefined) updateData.pinned = pinned;
  if (mode !== undefined) updateData.mode = mode;

  const { data: chat, error } = await supabaseAdmin
    .from('chats')
    .update(updateData)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error || !chat) {
    res.status(404);
    throw new Error('Chat not found or update failed');
  }

  res.json({ chat: { ...chat, _id: chat.id } });
});

/**
 * @route   DELETE /api/chats/:id
 * @desc    Delete a chat
 * @access  Protected
 */
export const deleteChat = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin
    .from('chats')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) {
    res.status(404);
    throw new Error('Chat not found or delete failed');
  }

  res.json({ message: 'Chat deleted' });
});

/**
 * @route   POST /api/chats/:id/messages
 * @desc    Send a message and get AI response
 * @access  Protected
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const chatId = req.params.id;
  const userId = req.user.id;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Please enter a message');
  }

  // 1. Verify chat belongs to user
  const { data: chat, error: chatError } = await supabaseAdmin
    .from('chats')
    .select('id, title, mode')
    .eq('id', chatId)
    .eq('user_id', userId)
    .single();

  if (chatError || !chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // 2. Insert user message
  const { data: userMessage, error: userMsgError } = await supabaseAdmin
    .from('messages')
    .insert({
      chat_id: chatId,
      user_id: userId,
      role: 'user',
      type: 'text',
      content: message.trim()
    })
    .select()
    .single();

  if (userMsgError) throw new Error(userMsgError.message);

  // 3. Fetch latest 20 context messages
  const { data: contextMessages, error: ctxError } = await supabaseAdmin
    .from('messages')
    .select('role, content, type')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (ctxError) throw new Error(ctxError.message);

  // Reverse to chronological
  const chronologicalContext = contextMessages.reverse();

  // Format context for Gemini (ignore image blobs, keep text/summarize images)
  const history = chronologicalContext.slice(0, -1).map(m => ({
    role: m.role,
    content: m.type === 'image' ? '[Image generated]' : m.content
  }));

  // 4. Get Gemini response
  let aiResponseText;
  try {
    aiResponseText = await generateGeminiResponse(history, message.trim());
  } catch (err) {
    console.error('Gemini error:', err);
    throw new Error('Gemini could not generate a response right now. Please try again.');
  }

  // 5. Insert assistant message
  const { data: assistantMessage, error: asstMsgError } = await supabaseAdmin
    .from('messages')
    .insert({
      chat_id: chatId,
      user_id: userId,
      role: 'assistant',
      type: 'text',
      content: aiResponseText
    })
    .select()
    .single();

  if (asstMsgError) throw new Error(asstMsgError.message);

  // 6. Update chat title if needed, and last_message_at
  const updateData = { last_message_at: new Date().toISOString() };
  if (chat.title === 'New Chat') {
    updateData.title = sanitizeTitle(message);
  }

  const { data: updatedChat, error: chatUpdateError } = await supabaseAdmin
    .from('chats')
    .update(updateData)
    .eq('id', chatId)
    .select()
    .single();

  if (chatUpdateError) throw new Error(chatUpdateError.message);

  res.json({
    chat: { ...updatedChat, _id: updatedChat.id },
    userMessage: { ...userMessage, _id: userMessage.id },
    assistantMessage: { ...assistantMessage, _id: assistantMessage.id },
  });
});
