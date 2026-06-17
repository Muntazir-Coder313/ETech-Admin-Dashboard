import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, RefreshCw, Send, Paperclip, Smile, MoreVertical,
  Phone, Video, Info, ChevronLeft, ChevronRight,
  Star, Star as StarFilled, Download, Archive, Trash2, CheckCheck,
  Clock, Users, AlertCircle, Inbox, Mail, MailOpen,
  User, Calendar, Image, File, Mic, Camera
} from 'lucide-react';

// Generate avatar
const getAvatar = (name) => {
  const seed = name.replace(/\s/g, '').toLowerCase();
  const gender = Math.random() > 0.5 ? 'women' : 'men';
  const id = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format message date
const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

// Generate random past dates
const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0);
  return date.toISOString();
};

// Message templates for random conversations
const messageTemplates = [
  { text: 'Hey! How are you doing?', sender: 'them' },
  { text: 'I\'m good, thanks for asking! How about you?', sender: 'you' },
  { text: 'Doing great! Just finished the project.', sender: 'them' },
  { text: 'That\'s awesome! Can you share the details?', sender: 'you' },
  { text: 'Sure, I\'ll send you the link shortly.', sender: 'them' },
  { text: 'Perfect! I\'ll review it asap.', sender: 'you' },
  { text: 'Let me know if you need any changes.', sender: 'them' },
  { text: 'Will do. Thanks!', sender: 'you' },
  { text: 'No problem at all!', sender: 'them' },
  { text: 'Are you free for a quick call?', sender: 'them' },
  { text: 'Yes, call me anytime!', sender: 'you' },
  { text: 'Great! I\'ll call you in 5 minutes.', sender: 'them' },
  { text: 'OK, I\'ll be waiting.', sender: 'you' },
  { text: 'Can you send me the latest report?', sender: 'them' },
  { text: 'Sure, just attached it to this chat.', sender: 'you' },
  { text: 'Got it. Looking good!', sender: 'them' },
  { text: 'Thanks for confirming.', sender: 'you' },
  { text: 'Don\'t forget about the meeting tomorrow!', sender: 'them' },
  { text: 'Yes, I already put it in my calendar.', sender: 'you' },
  { text: 'Great! See you there.', sender: 'them' },
  { text: 'Looking forward to it!', sender: 'you' },
  { text: 'I have a question about the design.', sender: 'them' },
  { text: 'What would you like to know?', sender: 'you' },
  { text: 'Can we make it more modern?', sender: 'them' },
  { text: 'Absolutely! I\'ll work on a new version.', sender: 'you' },
  { text: 'Perfect! Let me know when it\'s ready.', sender: 'them' },
  { text: 'Will do. It should be done by Friday.', sender: 'you' },
  { text: 'Thanks for the update!', sender: 'them' },
  { text: 'You\'re welcome!', sender: 'you' },
];

// Generate conversation messages
const generateMessages = (num, senderName) => {
  const messages = [];
  for (let i = 0; i < num; i++) {
    const template = messageTemplates[i % messageTemplates.length];
    const sender = template.sender === 'you' ? 'You' : senderName;
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    messages.push({
      id: Date.now() + i + Math.random() * 100,
      sender: sender,
      text: template.text,
      timestamp: randomDate(daysAgo),
    });
  }
  // Sort by date
  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return messages;
};

// Generate 30+ people
const generatePeople = () => {
  const names = [
    'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
    'Frank Miller', 'Grace Lee', 'Henry Clark', 'Ivy Martinez', 'Jack White',
    'Karen Taylor', 'Leo Anderson', 'Mia Thomas', 'Noah Jackson', 'Olivia Harris',
    'Paul Thompson', 'Quinn Garcia', 'Rachel Robinson', 'Sam Walker', 'Tina Hall',
    'Uma Patel', 'Victor Allen', 'Wendy Young', 'Xavier King', 'Yara Scott',
    'Zachary Green', 'Sophia Adams', 'Liam Nelson', 'Emily Carter', 'James Mitchell',
    'Ava Perez', 'Oliver Roberts', 'Isabella Turner', 'Ethan Phillips', 'Mia Campbell'
  ];
  
  const conversations = [];
  const currentUser = 'You';
  
  names.forEach((name) => {
    const numMessages = Math.floor(Math.random() * 8) + 3;
    const msgs = generateMessages(numMessages, name);
    const lastMsg = msgs[msgs.length - 1];
    const unreadCount = Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0;
    
    conversations.push({
      id: Date.now() + Math.random() * 1000 + conversations.length,
      participants: [currentUser, name],
      lastMessage: lastMsg ? lastMsg.text : 'No messages yet',
      timestamp: lastMsg ? lastMsg.timestamp : new Date().toISOString(),
      unread: unreadCount,
      messages: msgs,
    });
  });
  
  // Sort by latest timestamp
  conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return conversations;
};

// Helper: get other participant
const getOtherParticipant = (conversation, currentUser = 'You') => {
  return conversation.participants.find(p => p !== currentUser);
};

// Conversation List Item
const ConversationItem = ({ conversation, currentUser, isActive, onClick }) => {
  const other = getOtherParticipant(conversation, currentUser);
  const avatar = getAvatar(other);
  const unread = conversation.unread || 0;
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
    >
      <img src={avatar} alt={other} className="w-12 h-12 rounded-full ring-1 ring-gray-300 dark:ring-gray-600 object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-800 dark:text-white truncate">{other}</span>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatTime(conversation.timestamp)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</span>
          {unread > 0 && <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">{unread}</span>}
        </div>
      </div>
    </div>
  );
};

// Message Bubble
const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOwn && (
        <img src={getAvatar(message.sender)} alt={message.sender} className="w-8 h-8 rounded-full mr-2 self-end object-cover" />
      )}
      <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isOwn ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'}`}>
        <p className="text-sm break-words">{message.text}</p>
        <span className={`text-[10px] ${isOwn ? 'text-blue-200' : 'text-gray-400'} block text-right mt-1`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
      {isOwn && (
        <img src={getAvatar('You')} alt="You" className="w-8 h-8 rounded-full ml-2 self-end object-cover" />
      )}
    </div>
  );
};

// Main Chat Component
const Messages = () => {
  const [conversations, setConversations] = useState(generatePeople());
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = 'You';

  const selectedConversation = conversations.find(c => c.id === selectedId);
  const otherParticipant = selectedConversation ? getOtherParticipant(selectedConversation, currentUser) : '';

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    return conversations.filter(c => {
      const other = getOtherParticipant(c, currentUser);
      return other.toLowerCase().includes(searchTerm.toLowerCase()) ||
             c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);

  // Simulate loading
  const fetchMessages = useCallback(async (showToast = false) => {
    setLoading(true);
    setTimeout(() => {
      const newConvs = generatePeople();
      setConversations(newConvs);
      setSelectedId(newConvs[0]?.id || null);
      setLoading(false);
      if (showToast) toast.success('Messages refreshed');
    }, 500);
  }, []);

  // Send new message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const newMsg = {
      id: Date.now(),
      sender: currentUser,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    // Update conversation
    const updatedConvs = conversations.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: newMsg.text,
          timestamp: newMsg.timestamp,
          unread: 0,
        };
      }
      return c;
    });
    setConversations(updatedConvs);
    setNewMessage('');
    toast.success('Message sent');
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mark conversation as read
  const markAsRead = (conversationId) => {
    setConversations(conversations.map(c => {
      if (c.id === conversationId) return { ...c, unread: 0 };
      return c;
    }));
  };

  // Select conversation and mark read
  const selectConversation = (id) => {
    setSelectedId(id);
    markAsRead(id);
  };

  // Delete conversation
  const deleteConversation = (id) => {
    if (window.confirm('Delete this conversation?')) {
      setConversations(conversations.filter(c => c.id !== id));
      if (selectedId === id) {
        setSelectedId(conversations.filter(c => c.id !== id)[0]?.id || null);
      }
      toast.success('Conversation deleted');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[500px] space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">💬 Messages</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time chat with {conversations.length} contacts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setRefreshing(true); fetchMessages(true); }} disabled={refreshing} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-xl shadow transition"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex h-full min-h-[400px]">
        
        {/* Left Panel: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.map(c => (
              <ConversationItem 
                key={c.id} 
                conversation={c} 
                currentUser={currentUser}
                isActive={c.id === selectedId}
                onClick={() => selectConversation(c.id)}
              />
            ))}
            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-gray-400">No conversations found</div>
            )}
          </div>
        </div>

        {/* Right Panel: Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <img src={getAvatar(otherParticipant)} alt={otherParticipant} className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover" />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{otherParticipant}</h3>
                  <span className="text-xs text-gray-500">{selectedConversation.messages.length} messages</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Phone size={18} className="text-gray-600" /></button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Video size={18} className="text-gray-600" /></button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Info size={18} className="text-gray-600" /></button>
                <button onClick={() => deleteConversation(selectedId)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition"><Trash2 size={18} className="text-red-500" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50/30 dark:bg-gray-900/20">
              {selectedConversation.messages.map((msg, index) => {
                const isOwn = msg.sender === currentUser;
                const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(selectedConversation.messages[index-1].timestamp).toDateString();
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-2">
                        <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">{formatMessageDate(msg.timestamp)}</span>
                      </div>
                    )}
                    <MessageBubble message={msg} isOwn={isOwn} />
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Paperclip size={18} className="text-gray-500" /></button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Smile size={18} className="text-gray-500" /></button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <Inbox size={48} className="mx-auto mb-2 opacity-30" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;