
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  conversation_id: string;
}

export interface Conversation {
  id: string;
  with_user_id: string;
  with_user_name: string;
  with_user_avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}
