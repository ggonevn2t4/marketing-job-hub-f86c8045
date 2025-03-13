
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserConversations, getConversationMessages } from '@/services/messageService';
import type { Conversation, Message } from '@/types/message';
import MessageDialog from '@/components/messaging/MessageDialog';
import { AuthenticationRequired } from '@/components/jobs/job-posting/AuthenticationRequired';

const Conversations = () => {
  const { user, userRole } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userConversations = await getUserConversations();
      setConversations(userConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsMessageDialogOpen(true);
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return <AuthenticationRequired />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Tin nhắn</h1>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : conversations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Bạn chưa có tin nhắn nào.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {conversations.map(conversation => (
                    <Card 
                      key={conversation.id} 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        conversation.unread_count > 0 ? 'border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={conversation.with_user_avatar} />
                            <AvatarFallback>{getInitials(conversation.with_user_name)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium truncate">{conversation.with_user_name}</h3>
                              <span className="text-xs text-muted-foreground">
                                {conversation.last_message_time ? formatMessageDate(conversation.last_message_time) : ''}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.last_message}
                            </p>
                          </div>
                          
                          {conversation.unread_count > 0 && (
                            <Badge className="ml-2">{conversation.unread_count}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : conversations.filter(c => c.unread_count > 0).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Không có tin nhắn chưa đọc.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {conversations
                    .filter(c => c.unread_count > 0)
                    .map(conversation => (
                      <Card 
                        key={conversation.id} 
                        className="cursor-pointer hover:border-primary transition-all border-l-4 border-l-primary"
                        onClick={() => handleConversationClick(conversation)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={conversation.with_user_avatar} />
                              <AvatarFallback>{getInitials(conversation.with_user_name)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-medium truncate">{conversation.with_user_name}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {conversation.last_message_time ? formatMessageDate(conversation.last_message_time) : ''}
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.last_message}
                              </p>
                            </div>
                            
                            <Badge className="ml-2">{conversation.unread_count}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedConversation && (
        <MessageDialog
          isOpen={isMessageDialogOpen}
          onClose={() => {
            setIsMessageDialogOpen(false);
            loadConversations(); // Reload conversations when closing dialog to update unread counts
          }}
          recipientId={selectedConversation.with_user_id}
          recipientName={selectedConversation.with_user_name}
          recipientAvatar={selectedConversation.with_user_avatar}
        />
      )}
    </Layout>
  );
};

export default Conversations;
