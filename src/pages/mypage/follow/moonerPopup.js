import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../../../assets/css/moonerPopup.css';
import DiaryCard from '../../../components/diaryCard';
import exit from '../../../assets/images/exit.png';

const MoonerPopup = ({ follower, onClose }) => {
    const [diaries, setDiaries] = useState([]);
    const [pinCount, setPinCount] = useState(0);
    const [relationship, setRelationship] = useState(null);
    const [btnText, setBtnText] = useState('');
    const [sign_id, setSignId] = useState(null);

    // JWT에서 sign_id를 가져와 설정
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const savedSignId = decoded.sign_id;
                if (savedSignId) {
                    setSignId(savedSignId);
                }
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    // 팔로우 상태를 가져오는 함수
    useEffect(() => {
        const fetchRelationshipStatus = async () => {
            if (sign_id && follower.User) {
                try {
                    // 두 API를 병렬로 호출
                    const [followersResponse, followingsResponse] = await Promise.all([
                        axios.get(`https://api.usdiary.site/friends/${sign_id}/followers`, {
                            params: { friend_id: follower.User }
                        }),
                        axios.get(`https://api.usdiary.site/friends/${sign_id}/followings`, {
                            params: { friend_id: follower.User }
                        })
                    ]);

                    // 관계 상태 확인
                    let relationshipStatus = null;
                    let relationshipText = '';

                    // followers에서 관계 상태 확인
                    const isFollower = followersResponse.data.some(f => f.User === follower.User);
                    const isFollowing = followingsResponse.data.some(f => f.User === follower.User);

                    if (isFollower && isFollowing) {
                        relationshipStatus = 'friend';
                        relationshipText = '무너';
                    } else if (isFollower) {
                        relationshipStatus = 'requested';
                        relationshipText = '무너 신청 중';
                    } else {
                        relationshipStatus = 'none';
                        relationshipText = '무너맺기';
                    }

                    setRelationship(relationshipStatus);
                    setBtnText(relationshipText);

                } catch (error) {
                    console.error("Error fetching relationship status:", error);
                }
            }
        };

        fetchRelationshipStatus();
    }, [sign_id, follower.User]);

    // 일기 데이터 가져오기
    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await axios.get(`https://api.usdiary.site/friends/search/nickname`);
                const data = response.data.data;
                setDiaries(data.recent_diaries);
                setPinCount(data.recent_diaries.length);
            } catch (error) {
                console.error('Error fetching diary data:', error);
            }
        };

        fetchDiaries();
    }, []);

    // 게시판 이름 변환 함수
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

    // 일기 클릭 핸들러
    const handleDiaryClick = (diaryId) => {
        console.log('Diary clicked with ID:', diaryId);
    };

    // 팔로우/언팔로우 버튼 클릭 핸들러
    const handleFollowClick = async () => {
        if (btnText === '무너') {
            await deleteFollowing(); // 팔로잉 삭제
            setBtnText('무너맺기');
        } else if (btnText === '무너맺기') {
            await followUser(); // 팔로우 요청
            setBtnText('무너 신청 중');
        }
    };

    // 팔로우 요청
    const followUser = async () => {
        try {
            await axios.post(`https://api.usdiary.site/friends/follow-request`, {
                requested_sign_id: follower.User,
            });
            setRelationship('requested');
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    // 팔로잉 삭제
    const deleteFollowing = async () => {
        try {
            await axios.delete(`https://api.usdiary.site/friends/${sign_id}/followings`, {
                data: {
                    sign_id: sign_id,
                    follower_sign_id: follower.User,
                }
            });
            setRelationship(null);
        } catch (error) {
            console.error("Error deleting following:", error);
        }
    };

    return (
        <div className="mooner-popup-overlay">
            <div className='mooner-popup'>
                <div className='mooner-popup-content'>
                    <img src={exit} className="mooner-popup_close" alt="Close popup" onClick={onClose} />
                    <div className='mooner-popup-profile'>
                        <div className='mooner-popup-profile_friend'>
                            <img src={follower.friend_profile_img} className='mooner-popup-profile_friend_img' alt='profile' />
                            <div className='mooner-popup-profile_friend_text'>
                                <div className='mooner-popup-profile_friend_text_nickname'>{follower.friend_nick}</div>
                                <div className='mooner-popup-profile_friend_text_board'>{getBoardText(follower.user_tendency)}</div>
                            </div>
                            <div className='mooner-popup-profile_friend_btn' onClick={handleFollowClick}>{btnText}</div>
                        </div>
                        <div className='mooner-popup-profile_pins'>
                            <div className='mooner-popup-profile_pins_name'>Pins</div>
                            <div className='mooner-popup-profile_pins_diaries'>
                                {pinCount === 0 ? (
                                    <p>고정된 일기가 없습니다</p>
                                ) : (
                                    (diaries && diaries.length > 0 ? diaries : []).slice(0, pinCount).map((diary) => (
                                        <DiaryCard
                                            key={diary.diary_id}
                                            diary_title={diary.diary_title}
                                            createdAt={diary.createdAt}
                                            diary_content={diary.diary_content}
                                            post_photo={diary.post_photo}
                                            user_tendency={follower.user_tendency}
                                            friend_nick={follower.user_nick}
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
