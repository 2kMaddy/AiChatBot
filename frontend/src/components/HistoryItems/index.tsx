import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MdDelete } from 'react-icons/md';
import { UserAuth } from '../../context/AuthContext';
import {
  userChatHistory,
  deleteChatById,
} from '../../helpers/apiCommunicators';
import { ClipLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

interface Session {
  lastMessage: string;
  sessionTime: Date;
  sessionId: string;
  chats: unknown[]; // Replace 'unknown' with the actual chat type if available
}

const getChatHistory = async () => {
  await userChatHistory();
  const chatHistoryString = localStorage.getItem('chatHistory');
  const chatHistory = chatHistoryString ? JSON.parse(chatHistoryString) : null;
  return chatHistory;
};

const formatVideoAge = (sessionTime: Date) => {
  const ageOfVideo = formatDistanceToNow(new Date(sessionTime)).split(' ');
  if (ageOfVideo.length > 2) {
    ageOfVideo.shift();
  }
  ageOfVideo.push('ago');
  const formattedAge = ageOfVideo.join(' ');
  return formattedAge;
};

interface HistoryPageItemProps extends Session {
  deleteSessionById: (sessionId: string) => void;
  getChatSessionById: (sessionId: string) => void;
}

const historyPageItemContainer = (props: HistoryPageItemProps) => {
  const {
    lastMessage,
    sessionTime,
    sessionId,
    deleteSessionById,
    getChatSessionById,
  } = props;
  const formattedAge = formatVideoAge(sessionTime);

  const auth = UserAuth() || null;
  const { isDarkMode } = auth || {};
  const darkClass = isDarkMode ? 'dark' : '';

  return (
    <>
      <li className={`history-item ${darkClass}`} key={sessionId}>
        <div
          className="history-item-content"
          onClick={() => getChatSessionById(sessionId)}
        >
          <p className="history-msg">{lastMessage}</p>
          <p className="history-time">{formattedAge}</p>
        </div>
        <button
          type="button"
          className={`delete-button ${darkClass}`}
          onClick={() => deleteSessionById(sessionId)}
        >
          <MdDelete />
        </button>
      </li>
    </>
  );
};

export const HistoryPageList = () => {
  const navigate = useNavigate();

  const getChatSessionById = (sessionId: string) => {
    const chatHistoryString = localStorage.getItem('chatHistory');
    const chatHistory = chatHistoryString && JSON.parse(chatHistoryString);
    const filteredChat = (chatHistory as Session[]).filter(
      (each: Session) => each.sessionId === sessionId
    );

    const { chats, sessionId: filteredSessionId } = filteredChat[0];
    localStorage.setItem('currentChatList', JSON.stringify(chats));
    localStorage.setItem('currentSessionId', JSON.stringify(filteredSessionId));
    navigate('/chat');
  };

  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    const history = await getChatHistory();
    setChatHistory(history || []);
    setIsLoading(false);
  };

  const deleteSessionById = async (sessionId: string) => {
    const currentSessionIdString = localStorage.getItem('currentSessionId');
    const currentSession =
      currentSessionIdString && JSON.parse(currentSessionIdString);
    if (sessionId === currentSession) {
      localStorage.removeItem('currentSessionId');
      localStorage.removeItem('currentChatList');
    }
    await deleteChatById(sessionId);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <ClipLoader
            color="#c5198d"
            loading={isLoading}
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : chatHistory && chatHistory.length > 0 ? (
        chatHistory.map((each: Session) =>
          historyPageItemContainer({
            ...each,
            deleteSessionById,
            getChatSessionById,
          })
        )
      ) : (
        <div className="no-history">
          <h1>No Data Found</h1>
          <Link to="/chat">
            <button type="button" className="get-started-btn">
              Start Chat
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

const historyDashboardItem = (props: Session) => {
  const { lastMessage, sessionTime, sessionId } = props;
  const formattedAge = formatVideoAge(sessionTime);
  return (
    <li className="history-item-container" key={sessionId}>
      <h1 className="chat-title">{lastMessage}</h1>
      <p className="chat-time">{formattedAge}</p>
    </li>
  );
};

export const HistoryDashBoardList = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    const history = await getChatHistory();
    setChatHistory(history || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <ClipLoader
            color="#c5198d"
            loading={isLoading}
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : chatHistory && chatHistory.length > 0 ? (
        chatHistory.slice(-4).map((each: Session) => historyDashboardItem(each))
      ) : (
        <div className="no-history-dash">
          <h1>No History</h1>
        </div>
      )}
    </>
  );
};
