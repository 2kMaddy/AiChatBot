import { UserAuth } from '../../context/AuthContext';
import AiResponseFormatter from '../AIResponseFormatter';
import './index.css';

interface ChatItem {
  sender: string;
  message: string;
  timestamp: Date;
}

interface Props {
  chats: ChatItem[];
}

const ChatBubbles = ({ chats }: Props) => {
  const auth = UserAuth() || null;
  const { isDarkMode } = auth || {};

  return (
    <div className="chat-bubbles-container">
      {chats.map((chat, index) => (
        <div
          key={index}
          className={`chat-bubble ${chat.sender === 'user' ? 'user' : 'ai'} ${
            chat.sender === 'ai' && isDarkMode ? 'ai-dark' : ''
          } 
          ${chat.sender === 'user' && isDarkMode ? 'user-dark' : ''}`}
        >
          {chat.sender === 'ai' && (
            <img src="brain_icon.png" className="chat-bubble-icon" />
          )}
          {chat.sender === 'ai' ? (
            <p>
              <AiResponseFormatter rawResponse={chat.message} />
            </p>
          ) : (
            <p>{chat.message}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatBubbles;
