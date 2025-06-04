import Cookies from 'js-cookie';

const baseAPIURL = 'https://aichatbot-5czo.onrender.com/api';
const token = Cookies.get('jwt_token');

const saveUserDataLocal = (
  name: string,
  email: string,
  id: string,
  jwt_token: string
) => {
  const userDetails = JSON.stringify({ name, email, id });
  localStorage.setItem('userDetails', userDetails);
  Cookies.set('jwt_token', jwt_token);
};

export const userSignup = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const signUpUrl = baseAPIURL + '/user/signup';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    };
    const response = await fetch(signUpUrl, options);
    console.log(response);
    const data = await response.json();
    saveUserDataLocal(data.name, data.email, data.id, data.jwt_token);
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const loginUrl = baseAPIURL + '/user/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    };
    const response = await fetch(loginUrl, options);
    const data = await response.json();
    saveUserDataLocal(data.name, data.email, data.id, data.jwt_token);
    return data;
  } catch (e) {
    console.log(e);
  }
};

interface UserDetails {
  name: string;
  email: string;
  id: string;
}

const getUserId = () => {
  const userDetailsString = localStorage.getItem('userDetails');
  const userDetails: UserDetails | null = userDetailsString
    ? JSON.parse(userDetailsString)
    : null;
  return userDetails?.id;
};

export const userChatHistory = async () => {
  try {
    const userId = getUserId();
    const historyUrl = `${baseAPIURL}/chat/get-all-chats/${userId}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(historyUrl, options);
    const data = await response.json();
    const { chatsList } = data;
    localStorage.setItem('chatHistory', JSON.stringify(chatsList));
    return chatsList;
  } catch (e) {
    console.log(e);
  }
};

export const getResponseFromGemini = async (
  prompt: string,
  activeChatSessionId: string
) => {
  try {
    const userId = getUserId();
    const geminiUrl = baseAPIURL + `/chat/get-response-by-prompt/${userId}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, activeChatSessionId }),
    };
    const response = await fetch(geminiUrl, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteChatById = async (chatId: string) => {
  try {
    const userId = getUserId();
    const deleteUrl = baseAPIURL + `/chat/delete-chat/${userId}/${chatId}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(deleteUrl, options);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
