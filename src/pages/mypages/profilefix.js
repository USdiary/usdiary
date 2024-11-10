import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // 모달 라이브러리
import '../../assets/css/profilefix.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const ProfileFix = () => {
  const [activeButton, setActiveButton] = useState('Profile');
  const [profileImage, setProfileImage] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false); // 이메일 인증 모달 상태
  const [verificationCode, setVerificationCode] = useState(Array(6).fill('')); // 인증번호 입력 필드 상태
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(''); // 인증 상태
  const [userData, setUserData] = useState({
    user_nick: '',
    user_email: '',
    user_name: '',
    user_phone: '',
    user_birthday: '',
    user_gender: '',
    user_id: '',
    user_pwd: '',
    user_points: 0,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  // 로그인한 사용자 정보 가져오기
  const fetchUserData = async () => {
    try {
      const response = await fetch('/users/me');
      const result = await response.json();
      if (response.ok) {
        const userId = result.data.sign_id;
        fetchUserProfile(userId);
      } else {
        console.error('사용자 정보 가져오기 실패:', result.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // 개인정보 가져오기
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`/mypages/profiles/${userId}`);
      const result = await response.json();
      if (response.ok) {
        setUserData(result.data);
        if (result.data.profile_img) {
          setProfileImage(result.data.profile_img);
        }
      } else {
        console.error('개인정보 가져오기 실패:', result.message);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // 개인정보 수정 API 호출
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/mypages/profiles/${userData.sign_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('개인정보 수정 성공');
      } else {
        console.error('개인정보 수정 실패:', result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleButtonClick = (item) => {
    setActiveButton(item);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  // 이메일 중복 확인 버튼 클릭 시 모달 열기
  const handleEmailVerification = () => {
    setIsVerificationModalOpen(true);
  };

  // 팝업 닫기
  const handleClosePopup = () => {
    setIsVerificationModalOpen(false);
  };

  // 인증 코드 변경 처리
  const handleCodeChange = (e, index) => {
    const updatedCodes = [...verificationCode];
    updatedCodes[index] = e.target.value;
    setVerificationCode(updatedCodes);
  };

  // 인증 코드 검증
  const handleCodeVerification = () => {
    const code = verificationCode.join('');
    if (code === '123456') {
      setEmailVerificationStatus('인증을 성공했습니다.');
      setIsVerificationModalOpen(false);
    } else {
      setEmailVerificationStatus('다시 시도해주세요.');
    }
  };

  return (
    <div className="fix_page">
      <Menu />
      
      <div className="fix_page-container">
        <ProfileMenu />
        <div className="fix_content-box">
          {activeButton === 'Profile' && (
            <div className="fix_profile-section">
              <h2 className="fix_profile-title">개인정보 수정</h2>
              <hr className="fix_divider" />
              <div className="fix_profile-form">
                {/* 프로필 사진 */}
                  <div className="fix_form-group">
                    <label htmlFor="profile-image">프로필 사진</label>
                    <div className="fix_profile-image-container">
                      <div className="fix_profile-image-wrapper">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="fix_profile-image" />
                        ) : (
                          <div className="fix_profile-image-placeholder" style={{ backgroundColor: '#E0E0E0' }} />
                        )}
                      </div>
                      <div className="fix_profile-image-info">
                        <span className="fix_profile-image-text">프로필 사진을 등록해주세요.</span>
                        <span className="fix_profile-image-note">이미지 파일 크기 최대 2MB 미만</span>
                      </div>
                    </div>
                    <div className="fix_profile-buttons">
                    <label className="fix_upload-button" htmlFor="file-upload">등록</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="file-upload"
                      style={{ display: 'none' }} // 파일 선택창 숨기기
                    />
                    <button className="fix_remove-button" onClick={handleRemoveImage}>삭제</button>
                  </div>
                </div>

                {/* 이름 */}
                <div className="fix_form-group">
                  <label htmlFor="name">이름 *</label>
                  <input
                    type="text"
                    id="name"
                    className="fix_form-input"
                    style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }}
                    disabled
                    value={userData.user_name} // 사용자 이름 값
                  />
                </div>

                {/* 닉네임 */}
                <div className="fix_form-group">
                  <label htmlFor="nickname">닉네임 *</label>
                  <input
                    type="text"
                    id="nickname"
                    className="fix_form-input"
                    style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }}
                    disabled
                    value={userData.user_nick} // 사용자 닉네임 값
                  />
                </div>

                {/* 아이디 */}
                <div className="fix_form-group">
                  <label htmlFor="username">아이디 *</label>
                  <input
                    type="text"
                    id="sign_id"
                    className="fix_form-input"
                    style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }}
                    disabled
                    value={userData.user_id} // 사용자 아이디 값
                  />
                </div>
                
                {/* 비밀번호 */}
                <div className="fix_form-group">
                  <label htmlFor="password">비밀번호 *</label>
                  <input type="password" id="password" className="fix_form-input" placeholder="비밀번호 입력" />
                </div>

                {/* 비밀번호 확인 */}
                <div className="fix_form-group">
                  <label htmlFor="confirm-password">비밀번호 확인 *</label>
                  <input type="password" id="confirm-password" className="fix_form-input" placeholder="비밀번호 확인" />
                </div>

                {/* 이메일 */}
                <div className="fix_form-group">
                  <label htmlFor="email">이메일 *</label>
                  <div className="fix_email-split">
                    <input
                      type="text"
                      id="email"
                      className="fix_form-input"
                      value={userData.user_email} // 사용자 이메일 값
                      disabled
                    />
                    <span>@</span>
                    <input
                      type="text"
                      className="fix_form-input"
                      value={userData.user_email.split('@')[1]} // 이메일 '@' 뒤 부분
                      disabled
                    />
                  </div>
                  <button className="fix_verify-button" style={{ height: '40px' }} onClick={handleEmailVerification}>이메일 중복확인</button>
                </div>

                {/* 전화번호 */}
                <div className="fix_form-group">
                  <label htmlFor="phone">전화번호</label>
                  <div className="fix_phone-split">
                    <input
                      type="text"
                      className="fix_form-input"
                      value={userData.user_phone?.split('-')[0] || ''} // 전화번호 첫 번째 부분
                    />
                    <input
                      type="text"
                      className="fix_form-input"
                      value={userData.user_phone?.split('-')[1] || ''} // 전화번호 두 번째 부분
                    />
                    <input
                      type="text"
                      className="fix_form-input"
                      value={userData.user_phone?.split('-')[2] || ''} // 전화번호 세 번째 부분
                    />
                  </div>
                </div>

                {/* 생년월일 */}
                <div className="fix_form-group">
                  <label>생년월일 *</label>
                  <div className="fix_date-picker">
                    <select className="fix_form-input" value={userData.user_birthday?.split('-')[0] || ''}>
                      {Array.from({ length: 2024 - 1950 + 1 }, (_, i) => (
                        <option key={i} value={1950 + i}>{1950 + i}</option>
                      ))}
                    </select>
                    <select className="fix_form-input" value={userData.user_birthday?.split('-')[1] || ''}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}월</option>
                      ))}
                    </select>
                    <select className="fix_form-input" value={userData.user_birthday?.split('-')[2] || ''}>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}일</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 성별 */}
                <div className="fix_form-group">
                  <label htmlFor="gender">성별</label>
                  <select id="gender" className="fix_form-input" value={userData.user_gender}>
                    <option value="">선택 안 함</option>
                    <option value="female">여자</option>
                    <option value="male">남자</option>
                  </select>
                </div>

                {/* 성향 */}
                <div className="fix_form-group">
                  <label htmlFor="tendency">성향</label>
                  <input
                    type="text"
                    id="tendency"
                    className="fix_form-input"
                    disabled
                    value={userData.user_tendency} // 사용자 성향 값
                  />
                </div>

                {/* 포인트 */}
                <div className="fix_form-group">
                  <label htmlFor="points">포인트</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      id="points"
                      className="fix_form-input"
                      value={userData.user_points} // 사용자 포인트 값
                    />
                    <span>점</span>
                  </div>
                </div>
                <hr className="fix_divider" />

                {/* 수정 및 탈퇴 버튼 */}
                <div className="fix_form-actions">
                  <button className="fix_submit-button">수정</button>
                  <button className="fix_delete-account-button">회원 탈퇴</button>
                </div>
              </div>

              {/* 이메일 인증 모달 */}
              <Modal
                isOpen={isVerificationModalOpen}
                onRequestClose={handleClosePopup}
                className="SignUp-page__popup"
              >
                <div className="SignUp-page__popup-content">
                  <span className="SignUp-page__popup-close" onClick={handleClosePopup}>×</span>
                  <h2 className="SignUp-page__popup-title">이메일 인증</h2>
                  <p>이메일로 인증번호를 전송했습니다.</p>
                  <p>확인된 인증번호를 작성해주세요.</p>
                  <div className="SignUp-page__code-inputs">
                    {verificationCode.map((code, index) => (
                      <input
                        key={index}
                        type="text"
                        id={`code-${index}`}
                        className="SignUp-page__code-input"
                        maxLength="1"
                        value={code}
                        onChange={(e) => handleCodeChange(e, index)}
                      />
                    ))}
                  </div>
                  <button className="SignUp-page__code-submit-button" onClick={handleCodeVerification}>인증하기</button>
                  <p>{emailVerificationStatus}</p>
                </div>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileFix;
