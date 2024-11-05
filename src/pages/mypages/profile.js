import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/profile.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';
import BasicProfile from '../../assets/images/basicprofileimg.png'; // 기본 프로필 이미지 import

const base64UrlToBase64 = (base64Url) => {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  while (base64.length % 4) {
    base64 += '=';
  }

  return base64;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('토큰이 없습니다. 로그인 필요');
      return;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('JWT 형식이 잘못되었습니다.');
      return;
    }

    const userDataFromToken = JSON.parse(atob(base64UrlToBase64(tokenParts[1])));
    console.log('데이터', userDataFromToken);
    setUserData(userDataFromToken);
  }, []);

  const handleConfirm = async () => {
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    const response = await fetch('/users/check-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      navigate('/profilefix'); 
    } else {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='wrap'>
      <Menu />
      <div className='profile'>
        <ProfileMenu />
        <div className="pro_content-box">
          <div className="pro_profile-section">
            <div className="pro_profile-image-space">
              {/* 프로필 이미지와 닉네임 표시 */}
              <img
                src={userData.profile_img || BasicProfile} // 기본 프로필 이미지 사용
                alt="Profile"
                className="pro_profile-img"
              />
              <p className="pro_profile-username">{userData.user_nick}</p>
            </div>
            <div className="pro_additional-circle"></div>
            <div className="pro_password-container">
              <input
                type="password"
                className="pro_password-input"
                placeholder="비밀번호 확인"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && <p className="pro_error-message">{errorMessage}</p>}
              <button className="pro_confirm-button" onClick={handleConfirm}>확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
