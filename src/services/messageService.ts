
import { supabase } from '@/integrations/supabase/client';
import type { Message, Conversation } from '@/types/message';

// Send a message to a candidate
export const sendMessage = async (recipientId: string, content: string): Promise<Message | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const senderId = userData.user?.id;

    if (!senderId) {
      throw new Error('Bạn cần đăng nhập để gửi tin nhắn');
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data as Message;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

// Get all messages for a specific conversation
export const getConversationMessages = async (userId: string): Promise<Message[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData.user?.id;

    if (!currentUserId) {
      throw new Error('Bạn cần đăng nhập để xem tin nhắn');
    }

    // Get conversation ID
    const { data: conversationData, error: conversationError } = await supabase
      .from('messages')
      .select('conversation_id')
      .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .limit(1);

    if (conversationError || !conversationData || conversationData.length === 0) {
      // No conversation exists
      return [];
    }

    const conversationId = conversationData[0].conversation_id;

    // Get messages
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data as Message[];
  } catch (error) {
    console.error('Get conversation messages error:', error);
    return [];
  }
};

// Get all conversations for the current user
export const getUserConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      throw new Error('Bạn cần đăng nhập để xem tin nhắn');
    }

    // Get all unique conversations
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        is_read,
        created_at,
        conversation_id,
        profiles!sender_id(full_name, avatar_url),
        profiles!recipient_id(full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data into conversations
    const conversationsMap = new Map<string, Conversation>();
    
    data.forEach((message: any) => {
      const conversationId = message.conversation_id;
      
      // Determine the other user in the conversation
      const isUserSender = message.sender_id === userId;
      const otherUserId = isUserSender ? message.recipient_id : message.sender_id;
      const otherUserProfile = isUserSender ? 
        message.profiles.recipient_id : message.profiles.sender_id;
      
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          with_user_id: otherUserId,
          with_user_name: otherUserProfile?.full_name || 'Unnamed User',
          with_user_avatar: otherUserProfile?.avatar_url,
          last_message: message.content,
          last_message_time: message.created_at,
          unread_count: (!isUserSender && !message.is_read) ? 1 : 0
        });
      } else if (!isUserSender && !message.is_read) {
        // Increment unread count for messages not sent by the user and not read
        const conversation = conversationsMap.get(conversationId)!;
        conversation.unread_count += 1;
      }
    });

    return Array.from(conversationsMap.values());
  } catch (error) {
    console.error('Get user conversations error:', error);
    return [];
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      throw new Error('Bạn cần đăng nhập để đánh dấu tin nhắn đã đọc');
    }

    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('conversation_id', conversationId);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return false;
  }
};
