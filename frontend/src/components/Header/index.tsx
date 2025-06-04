import Cookies from 'js-cookie';
import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { PiCircleHalfTiltFill } from 'react-icons/pi';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { UserAuth } from '../../context/AuthContext';
import './index.css';

interface Props {
  title: string;
}

const Header = (props: Props) => {
  const { title } = props;
  const auth = UserAuth() || null;
  const { isDarkMode, toggleDarkMode } = auth || {};
  const darkClass = isDarkMode ? 'dark' : '';
  const navigate = useNavigate();

  const userLogout = () => {
    Cookies.remove('jwt_token');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('currentSessionId');
    localStorage.removeItem('currentChatList');
    navigate('/login');
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const afterOpenModal = () => {
    console.log('Modal opened!');
  };

  return (
    <div className={`header ${darkClass}`}>
      <div className={`option-icons ${darkClass}`}>
        <div className="page-title">
          <h1>{title}</h1>
        </div>
        <div>
          <button type="button" className="icon-btn" onClick={toggleDarkMode}>
            <PiCircleHalfTiltFill />
          </button>
          <button type="button" className="icon-btn" onClick={openModal}>
            <RiLogoutCircleLine />
          </button>
        </div>
      </div>
      <hr />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal} // This is important for accessibility (ESC key, clicking outside)
        className="popup"
      >
        <div>
          <h2>Are you sure, want to logout?</h2>
          <div className="popup-btn-container">
            <button
              type="button"
              className="logout-btn outline"
              onClick={userLogout}
            >
              Yes
            </button>
            <button type="button" className="logout-btn" onClick={closeModal}>
              No, Stay in
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
