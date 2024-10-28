import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';
import '../assets/css/login.css';
import Alarm from '../components/alarm';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAlarmOpen, setAlarmOpen] = useState(false);
    const [activeButton, setActiveButton] = useState('');
    const [user_id, setUserId] = useState(null);
    const [userTendency, setUserTendency] = useState(null);

    // 성향에 맞는 로컬스토리지 값 설정
    useEffect(() => {
        if (userTendency !== null) {
            localStorage.setItem('selectedMenu', userTendency === 1 ? 'forest' : userTendency === 2 ? 'city' : 'sea');
        }
    }, [userTendency]);

    // 서버호출
    useEffect(() => {
        const token = localStorage.getItem('token');
        let user_id = null;

        if (token) {
            const decodedToken = jwtDecode(token);
            user_id = decodedToken.user_id;
            console.log(user_id);
            setUserId(user_id);
        }

        if (user_id) {
            // 사용자 프로필 정보 가져오기
            axios.get(`/mypages/profiles/${user_id}`)
                .then((response) => {
                    console.log(response.data);
                    const userTendencyFromServer = response.data.data.user_tendency;
                    console.log(userTendencyFromServer);
                    
                    if (userTendencyFromServer === null) {
                        localStorage.removeItem('selectedMenu');
                    } else {
                        setUserTendency(userTendencyFromServer); // 성향 상태 업데이트
    
                        localStorage.setItem('selectedMenu', userTendencyFromServer === 1 ? 'forest' : userTendencyFromServer === 2 ? 'city' : 'sea');
                    }
                })
                .catch((error) => {
                    console.error('사용자 프로필 정보를 가져오는 중 에러 발생:', error);
                });
        }   else {
            // user_id가 없을 경우 로컬스토리지 초기화
            localStorage.removeItem('selectedMenu');
        }
    }, []);

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

    const handleLogoClick = (e) => {
        e.preventDefault();
    
        if (location.pathname === '/map') {
            return;
        }
    
        if (location.pathname === '/friend') {
            navigate('/friend');
            return;
        }
    
        if (userTendency === 1) {
            navigate('/forest');
        } else if (userTendency === 2) {
            navigate('/city');
        } else if (userTendency === 3) {
            navigate('/sea');
        }
    };

    return (
        <div className="menu">
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
