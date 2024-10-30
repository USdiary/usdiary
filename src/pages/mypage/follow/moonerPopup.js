import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/css/moonerPopup.css'; 
import DiaryCard from '../../../components/diaryCard';

import exit from '../../../assets/images/exit.png';

const MoonerPopup = ({ follower, onClose }) => {
    const [diaries, setDiaries] = useState([]);
    const [pinCount, setPinCount] = useState(0); // 핀의 개수를 상태로 관리
    const [relationship, setRelationship] = useState(true);
    const [btnText, setBtnText] = useState(relationship ? '무너' : '무너 맺기');

    const handleDiaryClick = (diaryId) => {
        console.log('Diary clicked with ID:', diaryId);
    };

    const getBoardText = (tendencyName) => {
        switch (tendencyName) {
            case "1":
                return "숲";
            case "2":
                return "도시";
            case "3":
                return "바다";
            default:
                return "알 수 없음";
        }
    };

    const handleClick = () => {
        if (btnText === '무너') {
          setBtnText('무너맺기');
          updateRelationship(false); // 무너에서 무너맺기로 상태 전환 시 false로 설정
        } else if (btnText === '무너맺기') {
          setBtnText('무너 신청 중');
          updateRelationship(true); // 무너맺기에서 무너 신청 중으로 상태 전환 시 true로 설정
        }
    }
    
    const updateRelationship = async (newRelationshipStatus) => {
        try {
            await axios.post('https://localhost:3001/mypage/follow', {
                requested_sign_id: follower.User,
            });
            setRelationship(newRelationshipStatus);
            console.log('서버로 관계 상태 전송 성공:', newRelationshipStatus);
        } catch (error) {
            console.error('서버로 관계 상태 전송 실패:', error);
        }
    };

    useEffect(() => {
        // 서버에서 다이어리 데이터와 핀의 개수를 가져오는 함수
        const fetchDiaries = async () => {
            try {
                const response = await fetch('/api/diaries'); // 서버 API 경로
                const data = await response.json();
                setDiaries(data.diaries); // 서버에서 받은 다이어리 데이터
                setPinCount(data.pinCount); // 서버에서 받은 핀의 개수
            } catch (error) {
                console.error('Error fetching diary data:', error);
            }
        };

        fetchDiaries();
    }, []);

    return (
        <div className="mooner-popup-overlay">
            <div className='mooner-popup'>
                <div className='mooner-popup-content'>
                    <img src={exit} className="mooner-popup_close" alt="Close popup" onClick={onClose}/>
                    <div className='mooner-popup-profile'>
                        <div className='mooner-popup-profile_friend'>
                            <img src={follower.friend_profile_img} className='mooner-popup-profile_friend_img' alt='profile'/>
                            <div className='mooner-popup-profile_friend_text'>
                                <div className='mooner-popup-profile_friend_text_nickname'>{follower.friend_nick
                                    }</div>
                                <div className='mooner-popup-profile_friend_text_board'>{getBoardText(follower.user_tendency)}</div>
                            </div>
                            <div className='mooner-popup-profile_friend_btn' onClick={handleClick}>{btnText}</div>
                        </div>
                        <div className='mooner-popup-profile_pins'>
                            <div className='mooner-popup-profile_pins_name'>Pins</div>
                            <div className='mooner-popup-profile_pins_diaries'>
                            {pinCount === 0 ? (
                                <p>고정된 일기가 없습니다</p> // 핀의 개수가 0일 때 표시
                            ) : (
                                diaries.slice(0, pinCount).map((diary) => (
                                    <DiaryCard
                                        key={diary.diary_id}
                                        diary_title={diary.diary_title}
                                        createdAt={diary.createdAt}
                                        diary_content={diary.diary_content}
                                        post_photo={diary.post_photo}
                                        user_tendency={diary.Board.user_tendency}
                                        friend_nick={diary.User.user_nick}
                                        diary_id={diary.diary_id}
                                        onClick={() => handleDiaryClick(diary.diary_id)}
                                    />
                                ))
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonerPopup;
