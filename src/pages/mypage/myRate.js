import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../assets/css/follow.css';
import '../../assets/css/myRate.css';
import 'react-datepicker/dist/react-datepicker.css';
import defaultImage from '../../assets/images/default.png'

import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const base64UrlToBase64 = (base64Url) => {
    // Base64Url에서 '-'를 '+'로, '_'를 '/'로 변환
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Base64 문자열의 길이를 4의 배수로 맞추기 위해 '=' 추가
    while (base64.length % 4) {
        base64 += '=';
    }
    return base64;
};

const MyRate = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [diaryCards, setDiaryCards] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('토큰이 없습니다. 로그인 필요');
            return;
        }

        // JWT를 '.' 기준으로 분리하여 payload 부분 가져오기
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('JWT 형식이 잘못되었습니다.');
            return;
        }

        const userDataFromToken = JSON.parse(atob(base64UrlToBase64(tokenParts[1])));
        setUser(userDataFromToken);
    }, []);

    useEffect(() => {
        if (user) {
            fetchDiaries(user.user_id);
        }
    }, [user]);

    const fetchDiaries = async (user_id) => {
        try {
            const response = await axios.get(`/mypage/diaries?user_id=${user_id}`);
            setDiaryCards(response.data)
        } catch (error) {
            console.error('일기를 가져오는 중 오류 발생:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>; // 사용자 데이터 로딩 중
    }

    const handleDiaryClick = (diary) => {
        const routes = {
            1: '/forest_diary',
            2: '/city_diary',
            3: '/sea_diary',
        };
        const route = routes[diary.board_id];
        if (route) {
            navigate(route, { state: { from: 'myRate', diary } });
        } else {
            console.log('Unknown board_id');
        }
    };

    const filterDiariesByPreference = (user_tendency) => {
        const categories = {
            '숲': 1,
            '도시': 2,
            '바다': 3,
        };
        return diaryCards.filter(diary => diary.board_id === categories[user_tendency]);
    };

    const preferenceDiaries = filterDiariesByPreference(user.user_tendency);
    const totalDiaries = diaryCards.length;
    const percentage = totalDiaries ? ((preferenceDiaries.length / totalDiaries) * 100).toFixed(2) : 0;

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];

        // 첫 번째 요일을 가져옴
        const firstDayOfWeek = date.getDay();

        // 그 달의 모든 날짜를 추가
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        // 마지막으로 빈 공간을 첫째 날 앞에 추가
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.unshift(null); // 빈 공간을 null로 표시
        }

        return days;
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

    const getBackgroundColor = (day) => {
        const localDay = new Date(day);
        localDay.setHours(0, 0, 0, 0); // 날짜만 남기기

        const diary = diaryCards.find(d => {
            const diaryDate = new Date(d.createdAt);
            diaryDate.setHours(diaryDate.getHours() - 9);
            diaryDate.setHours(0, 0, 0, 0); // 날짜만 남기기

            return d.user_id === user.user_id && localDay.toDateString() === diaryDate.toDateString();
        });

        switch (diary ? diary.board_id : null) {
            case 1:
                return '#B8D8AD'; // 숲
            case 2:
                return '#D9D9D9'; // 도시
            case 3:
                return '#A5DFDF'; // 바다
            default:
                return '#FFFFFF'; // 일기 없음
        }
    };

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDate(day);
            updateDiaryCards(day);
        }
    };

    const updateDiaryCards = (date) => {
        const diariesOnSelectedDate = diaryCards.filter(diary => {
            const diaryDate = new Date(diary.createdAt);
            diaryDate.setHours(diaryDate.getHours() - 9);
            return diaryDate.toDateString() === date.toDateString() && diary.user_id === user.user_id;
        });
        setDiaryCards(diariesOnSelectedDate);
    };

    const handlePreviousDay = () => {
        const previousDate = new Date(selectedDate);
        previousDate.setDate(previousDate.getDate() - 1);
        setSelectedDate(previousDate);
        // 해당 날짜의 일기 필터링
        updateDiaryCards(previousDate);
    };

    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
        // 해당 날짜의 일기 필터링
        updateDiaryCards(nextDate);
    };

    return (
        <div className='wrap'>
            <Menu />
            <div className='profile'>
                <ProfileMenu />
                <div className='myrate__profile-contents'>
                    <div className='profile-info'>
                        {user ? (
                            <>
                                {/* <img src={user.Profile.profile_img} alt='Profile' className='profile-image' /> */}
                                <div className='profile-summary'>
                                    <h3 className='profile-tendency'>{user.user_nick}님은 {percentage}% {user.user_tendency} 성향이에요</h3>
                                    <div className='progress-bar'>
                                        <div className='progress-bar-fill' style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>로딩 중...</p>
                        )}
                    </div>
                    <div className='calendar'>
                        <div className='calendar__header'>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&lt;</button>
                            <span>{currentDate.toLocaleString('ko-KR', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&gt;</button>
                        </div>
                        <div className='calendar__days'>
                            {daysInMonth.map((day, index) => (
                                <div
                                    key={index}
                                    className={`calendar__day ${day ? (day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() && day.getFullYear() === new Date().getFullYear() ? 'today' : '') : 'empty'}`}
                                    style={{ backgroundColor: day ? getBackgroundColor(day) : 'transparent' }}
                                    onClick={() => handleDayClick(day)}
                                >
                                    {day ? day.getDate() : ''}
                                </div>
                            ))}
                        </div>
                        <div className='category-indicator'>
                            <div className='indicator-box-forest'></div>
                            <span>숲</span>
                            <div className='indicator-box-city'></div>
                            <span>도시</span>
                            <div className='indicator-box-sea'></div>
                            <span>바다</span>
                            <div className='indicator-box-nothing'></div>
                            <span>일기 없음</span>
                        </div>
                    </div>
                    <div className='my-diaries'>
                        <div className='my-diaries-header'>
                            <div className='diary-box'>
                                <h4>내가 작성한 일기</h4>
                            </div>
                        </div>
                        {selectedDate && diaryCards.length > 0 && (
                            <div className='selected-date-box'>
                                {new Date(selectedDate).toLocaleDateString()}
                            </div>
                        )}
                        <div className='diary-cards'>
                            <button className='next-previous-button-left' onClick={handlePreviousDay}>&lt;</button>
                            {diaryCards.length > 0 ? diaryCards.map(diary => (
                                <div className='myrate__diary-card' key={diary.diary_id} onClick={() => handleDiaryClick(diary)}>
                                    {diary.post_photo && (
                                        <img
                                            src={diary.post_photo || defaultImage}
                                            alt={`${diary.diary_title} 이미지`}
                                            className='myrate__diary-card__image'
                                        />
                                    )}
                                    <h4>{diary.diary_title}</h4>
                                    <p className='myrate__diary-card__content'>{diary.diary_content.replace(/<[^>]+>/g, '').substring(0, 100)}</p>
                                </div>
                            )) : null}
                            <button className='next-previous-button-right' onClick={handleNextDay}>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRate;
