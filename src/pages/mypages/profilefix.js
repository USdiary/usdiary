import React, { useState } from 'react';
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
    // 여기에 이메일 인증 API 요청을 보내는 로직
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
    // 서버에 인증 코드를 검증하는 로직 추가
    if (code === '') { // 예시로 123456을 올바른 인증번호로 설정
      setEmailVerificationStatus('인증을 성공했습니다.');
      setIsVerificationModalOpen(false); // 성공 시 모달 닫기
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
                  <input type="text" id="name" className="fix_form-input" style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }} disabled />
                </div>

                {/* 아이디 */}
                <div className="fix_form-group">
                  <label htmlFor="username">아이디 *</label>
                  <input type="text" id="username" className="fix_form-input" style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }} disabled />
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
                    <input type="text" id="email" className="fix_form-input" />
                    <span>@</span>
                    <input type="text" className="fix_form-input" />
                  </div>
                  <button className="fix_verify-button" style={{ height: '40px' }} onClick={handleEmailVerification}>이메일 중복확인</button>
                </div>

                {/* 전화번호 */}
                <div className="fix_form-group">
                  <label htmlFor="phone">전화번호</label>
                  <div className="fix_phone-split">
                    <input type="text" className="fix_form-input" />
                    <input type="text" className="fix_form-input" />
                    <input type="text" className="fix_form-input" />
                  </div>
                </div>

                {/* 생년월일 */}
                <div className="fix_form-group">
                  <label>생년월일 *</label>
                  <div className="fix_date-picker">
                    <select className="fix_form-input">
                      {Array.from({ length: 2024 - 1950 + 1 }, (_, i) => (
                        <option key={i} value={1950 + i}>{1950 + i}</option>
                      ))}
                    </select>
                    <select className="fix_form-input">
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}월</option>
                      ))}
                    </select>
                    <select className="fix_form-input">
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}일</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 성별 */}
                <div className="fix_form-group">
                  <label htmlFor="gender">성별</label>
                  <select id="gender" className="fix_form-input">
                    <option value="">선택 안 함</option>
                    <option value="female">여자</option>
                    <option value="male">남자</option>
                  </select>
                </div>

                {/* 성향 */}
                <div className="fix_form-group">
                  <label htmlFor="tendency">성향</label>
                  <input type="text" id="tendency" className="fix_form-input" style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }} disabled />
                </div>

                {/* 포인트 */}
                <div className="fix_form-group">
                  <label htmlFor="points">포인트</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" id="points" className="fix_form-input" style={{ backgroundColor: '#EEEEEE', color: '#FFFFFF' }} disabled />
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
