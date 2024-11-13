import React, { useState } from 'react';
import '../../../assets/css/moonerPopup.css';
import DiaryCard from '../../../components/diaryCard';
import exit from '../../../assets/images/exit.png';
import defaultProfileImg from '../../../assets/images/default.png';
import moonerphoto1 from '../../../assets/images/moonerphoto1.jpg';
import moonerphoto2 from '../../../assets/images/moonerphoto2.jpg';
import moonerphoto3 from '../../../assets/images/moonerphoto3.jpg';

const MoonerPopup = () => {
    const [isOpen, setIsOpen] = useState(true); // 팝업 상태 관리

    const [diaries, setDiaries] = useState([
        {
            diary_id: 1,
            diary_title: "산책으로 시작한 11월",
            createdAt: "2024-11-01",
            diary_content: "11월인데 날씨가 너무 따뜻해!! 11월에도 산책을 할 수 있다니..",
            post_photo: moonerphoto1,
        },
        {
            diary_id: 2,
            diary_title: "고양이랑 함께한 할로윈",
            createdAt: "2024-10-31",
            diary_content: "오늘은 우동이와 함께한 첫 할로윈이다. 유령 우동이가 너무 ..",
            post_photo: moonerphoto2,
        },
        {
            diary_id: 3,
            diary_title: "뚜벅뚜벅 카페투어",
            createdAt: "2024-10-06",
            diary_content: "까눌레가 너무 먹고싶어서 무작정 떠났다!! 근데 완전 맛집을..",
            post_photo: moonerphoto3,
        },
    ]);

    const [pinCount] = useState(3);
    const [btnText, setBtnText] = useState('무너맺기');

    const follower = {
        friend_profile_img: defaultProfileImg,
        friend_nick: "OO님",
        user_tendency: "1",
    };

    /*
    const MoonerPopup = ({ follower, onClose }) => {
    const [diaries, setDiaries] = useState([]);
    const [pinCount, setPinCount] = useState(0); // 핀의 개수를 상태로 관리
    const [relationship, setRelationship] = useState(true);
    const [btnText, setBtnText] = useState(relationship ? '무너' : '무너 맺기');
    const handleDiaryClick = (diaryId) => {
        console.log('Diary clicked with ID:', diaryId);
    };
    */

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

    const handleDiaryClick = (diaryId) => {
        console.log('Diary clicked with ID:', diaryId);
    };

    const handleFollowClick = () => {
        if (btnText === '무너 승인됨') {
            setBtnText('무너맺기');
        } else if (btnText === '무너맺기') {
            setBtnText('무너 신청 중');
        } else if (btnText === '무너 신청 중') {
            setBtnText('무너맺기');
        } else if (btnText === '무너 거부됨') {
            setBtnText('무너맺기');
        }
    };

    /*const handleClick = () => {
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
            await axios.post(`https://api.usdiary.site/friends/follow-request`, {
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
                const response = await fetch(`https://api.usdiary.site/friends/search/nickname`); // 서버 API 경로
                const data = await response.json();
                setDiaries(data.diaries); // 서버에서 받은 다이어리 데이터
                setPinCount(data.pinCount); // 서버에서 받은 핀의 개수
    }, []);
    */

    const handleClose = () => {
        setIsOpen(false); // 팝업 닫기
    };

    if (!isOpen) return null; // isOpen이 false이면 팝업을 렌더링하지 않음

    return (
        <div className="mooner-popup-overlay">
            <div className='mooner-popup'>
                <div className='mooner-popup-content'>
                    <img src={exit} className="mooner-popup_close" alt="Close popup" onClick={handleClose} />
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
                                    diaries.map((diary) => (
                                        <DiaryCard
                                            key={diary.diary_id}
                                            diary_title={diary.diary_title}
                                            createdAt={diary.createdAt}
                                            diary_content={diary.diary_content}
                                            post_photo={diary.post_photo}
                                            handleDiaryClick={() => handleDiaryClick(diary.diary_id)}
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
