import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';
import '../assets/css/login.css';
import Alarm from '../components/alarm';
import axios from 'axios';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAlarmOpen, setAlarmOpen] = useState(false);
    const [activeButton, setActiveButton] = useState('');
    const [sign_id, setSignId] = useState(null);
    const [userTendency, setUserTendency] = useState(null); // 사용자 성향 초기값을 null로 설정

    // 성향에 맞는 로컬스토리지 값 설정
    const setTendencyMenu = (userTendency) => {
        if (userTendency === 1) {
            localStorage.setItem('selectedMenu', 'forest');
        } else if (userTendency === 2) {
            localStorage.setItem('selectedMenu', 'city');
        } else if (userTendency === 3) {
            localStorage.setItem('selectedMenu', 'sea');
        }
    };

    // 삭제 금지
    // 하드코딩된 성향 값 설정 (예: 1은 'forest', 2는 'city', 3은 'sea')
    // useEffect(() => {
    //     const hardcodedTendency = 1; // 예시로 'forest'로 설정
    //     setUserTendency(hardcodedTendency); // 성향 설정
    //     setTendencyMenu(hardcodedTendency); // 로컬스토리지 업데이트
    // }, []);

    // 서버호출
    useEffect(() => {
        axios.get('/users/login')
            .then((response) => {
                const signIdFromServer = response.data.sign_id; // 서버에서 받은 sign_id
                setSignId(signIdFromServer); // sign_id 상태 업데이트
            })
            .catch((error) => {
                console.error('sign_id를 가져오는 중 에러 발생:', error);
            });
    }, []);

    useEffect(() => {
        if (sign_id) {
            axios.get(`/users/${sign_id}/tendency`)
                .then((response) => {
                    const userTendencyFromServer = response.data.tendency; // 서버에서 받은 성향 값
                    setUserTendency(userTendencyFromServer); // 상태 업데이트
                    setTendencyMenu(userTendencyFromServer); // 로컬스토리지 업데이트
                })
                .catch((error) => {
                    console.error('성향 값을 가져오는 중 에러 발생:', error);
                });
        }
    }, [sign_id]);

    // 페이지 이동 시 성향에 따라 로컬스토리지 값 업데이트
    useEffect(() => {
        if (location.pathname.includes('forest')) {
            localStorage.setItem('selectedMenu', 'forest');
        } else if (location.pathname.includes('city')) {
            localStorage.setItem('selectedMenu', 'city');
        } else if (location.pathname.includes('sea')) {
            localStorage.setItem('selectedMenu', 'sea');
        }
    }, [location.pathname]);

    // 경로에 따라 활성 버튼 설정
    useEffect(() => {
        if (location.pathname === '/forest' || location.pathname === '/city' || location.pathname === '/sea' || location.pathname === '/friend') {
            setActiveButton('home');
        } else if (location.pathname.includes('_diary')) {
            setActiveButton('diary');
        } else if (location.pathname === '/map') {
            setActiveButton('map');
        } else if (location.pathname === '/profile' || location.pathname.includes('mypage')) {
            setActiveButton('profile');
        }
    }, [location.pathname]);

    // 홈 버튼 클릭 시 성향에 따라 이동
    const handleHomeClick = (e) => {
        e.preventDefault();
        const savedMenu = localStorage.getItem('selectedMenu');
        if (savedMenu === 'forest') {
            navigate('/forest');
        } else if (savedMenu === 'city') {
            navigate('/city');
        } else if (savedMenu === 'sea') {
            navigate('/sea');
        }
    };

    // 다이어리 클릭 시 성향에 따라 다이어리 페이지 이동
    const handleDiaryClick = (e) => {
        e.preventDefault();
        const savedMenu = localStorage.getItem('selectedMenu');

        if (location.pathname !== '/friend') { // 친구 페이지에서는 다이어리로 이동하지 않도록 예외 처리
            if (savedMenu === 'forest') {
                navigate('/forest_diary');
            } else if (savedMenu === 'city') {
                navigate('/city_diary');
            } else if (savedMenu === 'sea') {
                navigate('/sea_diary');
            }
        }
    };

    const handleMapClick = (e) => {
        e.preventDefault();
        navigate('/map');
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        navigate('/profile');
    };

    const handleAlarmClick = () => {
        setAlarmOpen(!isAlarmOpen);
    };

    // 로고 클릭 시 성향에 따라 홈화면으로 이동하는 함수
    const handleLogoClick = (e) => {
        if (location.pathname === '/map') {
            e.preventDefault();
            return;
        }

        if (location.pathname === '/friend') {
            navigate('/friend');
            return;
        }

        const savedMenu = localStorage.getItem('selectedMenu');
        if (savedMenu === 'forest') {
            navigate('/forest');
        } else if (savedMenu === 'city') {
            navigate('/city');
        } else if (savedMenu === 'sea') {
            navigate('/sea');
        }
    };

    return (
        <div className="menu">
            {/* 로고 클릭 이벤트 추가 */}
            <div className="logo" onClick={handleLogoClick}>
                <img src={Logo_US} className="logo_us" alt="Logo US" />
                <img src={Logo_EARTH} className="logo_earth" alt="Logo Earth" />
            </div>
            <div className="button">
                <div className={`btn ${activeButton === 'home' ? 'active' : ''}`} onClick={handleHomeClick} id="home">HOME</div>
                <div className={`btn ${activeButton === 'diary' ? 'active' : ''}`} onClick={handleDiaryClick} id="diary">DIARY</div>
                <div className={`btn ${activeButton === 'map' ? 'active' : ''}`} onClick={handleMapClick} id="map">MAP</div>
                <div className={`btn ${activeButton === 'profile' ? 'active' : ''}`} onClick={handleProfileClick} id="profile">PROFILE</div>
                <div className="btn" onClick={handleAlarmClick} id="alarm">
                    <img src={alarm_white} className="alarm_white" alt="Alarm White" />
                    <img src={alarm_black} className="alarm_black" alt="Alarm Black" />
                </div>
            </div>

            {/* 알림 팝업 */}
            <Alarm isOpen={isAlarmOpen} onClose={handleAlarmClick} />
        </div>
    );
};

export default Menu;
