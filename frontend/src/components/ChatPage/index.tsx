import React, { useRef, useEffect, useState } from 'react';
import { BsFillArrowUpSquareFill } from 'react-icons/bs';
import { MoonLoader } from 'react-spinners';
import Header from '../Header';
import Navbar from '../Navbar';
import { UserAuth } from '../../context/AuthContext';
import { getResponseFromGemini } from '../../helpers/apiCommunicators';
import ChatBubbles from '../ChatBubbles';
import { GoPlus } from 'react-icons/go';
import './index.css';

const ChatPage = () => {
  const getCurrentSessionId = () => {
    const localSessionIdString = localStorage.getItem('currentSessionId');
    const localSessionId = localSessionIdString
      ? JSON.parse(localSessionIdString)
      : null;
    return localSessionId;
  };

  const auth = UserAuth() || null;
  const { isDarkMode } = auth || {};
  const darkClass = isDarkMode ? 'dark' : '';
  const [activeSessionId, setActiveSessionId] = useState(
    getCurrentSessionId() || 'newChat'
  );
  type ChatMessage = {
    sender: 'user' | 'ai';
    message: string;
    timestamp: Date;
  };

  const getCurrentChatFromLocal = () => {
    const localChatString = localStorage.getItem('currentChatList');
    const localChatList = localChatString ? JSON.parse(localChatString) : null;
    return localChatList;
  };

  const [chats, setChats] = useState<ChatMessage[]>(
    getCurrentChatFromLocal() || []
  );
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('currentChatList', JSON.stringify(chats));
  }, [chats]);

  const submitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const newChat: ChatMessage = {
      sender: 'user',
      message: userPrompt,
      timestamp: new Date(),
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setUserPrompt('');
    setIsLoading(true);
    if (!userPrompt.trim()) {
      return alert('Please enter a prompt.');
    }
    const response = await getResponseFromGemini(userPrompt, activeSessionId);

    const aiResponse: ChatMessage = {
      sender: 'ai',
      message: response.message || 'No response from AI',
      timestamp: new Date(),
    };
    setActiveSessionId(response.sessionId || 'newChat');
    setChats((prevChats) => [...prevChats, aiResponse]);
    setIsLoading(false);
  };

  const handleTextareaSubmit = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.code === 'Enter') {
      console.log(e.code);
      submitPrompt(e);
    }
  };

  const newChat = () => {
    setActiveSessionId('newChat');
    localStorage.removeItem('currentChatList');
    setChats([]);
    localStorage.removeItem('currectSessionId');
  };

  return (
    <div className={`chat-page-container ${darkClass}`}>
      <div className="nav-col">
        <Navbar id={'STARTCHAT'} />
      </div>
      <div className="right-col">
        <Header title={'AI Chat'} />
        <div className="chat-section">
          <div className="chat-bubble-section" ref={chatContainerRef}>
            {chats.length === 0 ? (
              <h1>What can I help you with?</h1>
            ) : (
              <ChatBubbles chats={chats} />
            )}
          </div>
          <form className="user-prompt-section" onSubmit={submitPrompt}>
            <textarea
              placeholder="Ask me anything..."
              value={userPrompt}
              className={`user-prompt-input ${darkClass}`}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={handleTextareaSubmit}
            />
            <button
              type="button"
              className={`new-chat-btn ${darkClass}`}
              onClick={newChat}
            >
              <GoPlus />
            </button>
            {isLoading ? (
              <div className="loader-btn">
                <MoonLoader
                  color="#c5198d"
                  size={24}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <button type="submit" className="send-btn">
                <BsFillArrowUpSquareFill />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
