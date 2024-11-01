import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import '../../assets/css/follow.css';
import '../../assets/css/myRate.css';
import 'react-datepicker/dist/react-datepicker.css';
import defaultImage from '../../assets/images/default.png';

import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const MyRate = () => {
    const [selectedDiary, setSelectedDiary] = useState([]);
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

        try {
            const userDataFromToken = jwtDecode(token);
            setUser(userDataFromToken);
            console.log('Decoded user data:', userDataFromToken);
        } catch (error) {
            console.error('JWT 디코딩 오류:', error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchDiariesByMonth(user.user_id, currentDate.getFullYear(), currentDate.getMonth() + 1);
        }
    }, [user, currentDate]);

    const fetchDiariesByMonth = async (user_id, year, month) => {
        setDiaryCards([]); // 이전 데이터를 초기화하여 새로운 달의 데이터만 보여주도록 설정

        try {
            const response = await axios.get(`/diaries?user_id=${user_id}&year=${year}&month=${month}&limit=31`);
            console.log("Fetched diaryCards for user:", user_id, response.data.data.diary);

            if (Array.isArray(response.data.data.diary)) {
                // 가져온 데이터 중에서 정확한 연도와 월을 만족하는 데이터만 필터링
                const filteredDiaries = response.data.data.diary.filter(diary => {
                    const diaryDate = new Date(diary.createdAt);
                    return (
                        diaryDate.getFullYear() === year &&
                        diaryDate.getMonth() + 1 === month
                    );
                });
                setDiaryCards(filteredDiaries);
            } else {
                console.error('일기 데이터 형식이 잘못되었습니다:', response.data);
                setDiaryCards([]);
            }
        } catch (error) {
            console.error('일기를 가져오는 중 오류 발생:', error);
            setDiaryCards([]);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
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
        const firstDayOfWeek = date.getDay();

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        for (let i = 0; i < firstDayOfWeek; i++) {
            days.unshift(null);
        }

        return days;
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

    const getBackgroundColor = (day) => {
        if (!day) return '#FFFFFF';

        const localDay = new Date(day);
        localDay.setHours(0, 0, 0, 0);

        const diary = diaryCards.find(diary => {
            const diaryDate = new Date(diary.createdAt);
            diaryDate.setHours(diaryDate.getHours() - 9);
            diaryDate.setHours(0, 0, 0, 0);

            return diary.user_id === user.user_id && localDay.toDateString() === diaryDate.toDateString();
        });

        switch (diary ? diary.board_id : null) {
            case 1:
                return '#B8D8AD';
            case 2:
                return '#D9D9D9';
            case 3:
                return '#A5DFDF';
            default:
                return '#FFFFFF';
        }
    };

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDate(day);
            updateSelectedDiary(day);
        }
    };

    const updateSelectedDiary = (date) => {
        const diariesOnSelectedDate = diaryCards.filter(diary => {
            const diaryDate = new Date(diary.createdAt);
            diaryDate.setHours(diaryDate.getHours() - 9);
            return diaryDate.toDateString() === date.toDateString() && diary.user_id === user.user_id;
        });
        setSelectedDiary(diariesOnSelectedDate.slice(0, 1));
    };

    const handlePreviousDay = () => {
        const previousDate = new Date(selectedDate);
        previousDate.setDate(previousDate.getDate() - 1);
        setSelectedDate(previousDate);
        updateSelectedDiary(previousDate);
    };

    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
        updateSelectedDiary(nextDate);
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
                                <img src={user.Profile ? user.Profile.profile_img : defaultImage} alt='Profile' className='profile-image' />
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
                            {selectedDiary.length > 0 ? selectedDiary.map(diary => (
                                <div className='myrate__diary-card' key={diary.diary_id} onClick={() => handleDiaryClick(diary)}>
                                    <img
                                        src={diary.post_photo && diary.post_photo !== '' ? diary.post_photo : defaultImage}
                                        alt={`${diary.diary_title} 이미지`}
                                        className='myrate__diary-card__image'
                                    />
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
