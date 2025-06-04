import { ReactNode, createContext, useContext, useState } from 'react';

type Chat = {
  sender: string;
  message: string;
  timestamp: Date;
};

type ChatsList = {
  chats: Chat[];
};

type UserAuth = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  chatsList: ChatsList | null;
  changeChatsList: (value: ChatsList) => void | undefined;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatsList, setChatsList] = useState<ChatsList | null>(null);

  const changeChatsList = (newChats: ChatsList) => {
    setChatsList((prev) => {
      if (prev) {
        return { chats: [...prev.chats, ...newChats.chats] };
      } else {
        return { chats: [...newChats.chats] };
      }
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    chatsList,
    changeChatsList,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => useContext(AuthContext);
