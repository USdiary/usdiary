import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/seaPopup.css';
import miniseaImage from '../assets/images/minisea.png';
import sirenIcon from '../assets/images/siren_sea.png';
import ReportPopup from './reportPopup';
import axios from 'axios';

import seashell from '../assets/images/seashell.png';
import umbrage from '../assets/images/umbrage.png';
import bicycle from '../assets/images/bicycle.png';
import duck from '../assets/images/duck.png';
import flower from '../assets/images/flower.png';
import watermelon from '../assets/images/watermelon.png';

import coffee from '../assets/images/coffee.png';
import book from '../assets/images/book.png';
import plate from '../assets/images/plate.png';
import film from '../assets/images/film.png';
import palette from '../assets/images/palette.png';
import shoppingbag from '../assets/images/shoppingbag.png';
import balloon from '../assets/images/balloon.png';
import uniform from '../assets/images/uniform.png';
import ticket from '../assets/images/ticket.png';

const iconMap = {
    1: seashell,
    2: umbrage,
    3: bicycle,
    4: duck,
    5: flower,
    6: watermelon,
    7: coffee,
    8: book,
    9: plate,
    10: film,
    11: palette,
    12: shoppingbag,
    13: balloon,
    14: uniform,
    15: ticket,
};

const SeaPopup = ({ diary_id, onClose }) => {
    const [diary, setDiary] = useState(null);
    const [todayPlace, setTodayPlace] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false); // 로딩 상태 초기화
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태
    const [error, setError] = useState(null);
    const [editingcomment_id, setEditingcomment_id] = useState(null);
    const commentRefs = useRef({});
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [currentUserProfile, setCurrentUserProfile] = useState({
        profile_img: miniseaImage,
        user_nick: 'CurrentUser'
    });

    const getIconClass = (cate_num) => {
        return `sea-popup__icon-${cate_num}`;
    };


    // 더미 데이터 호출 함수
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 다이어리 데이터 가져오기
                const diaryResponse = await axios.get(`/diaries/${diary_id}`);
                const fetchedDiary = diaryResponse.data;
                setDiary(fetchedDiary);

                const placeResponse = await axios.get(`/diaries/${diary_id}/today_place`);
                const fetchedPlace = placeResponse.data;
                setTodayPlace(fetchedPlace);
                setSelectedIcon(iconMap[fetchedPlace.cate_num]);

                // 댓글 데이터 가져오기
                const commentsResponse = await axios.get(`/diaries/${diary_id}/comments`);
                setComments(commentsResponse.data);

                // 사용자 프로필 가져오기
                const userProfileResponse = await axios.get('/user/profile');
                setCurrentUserProfile(userProfileResponse.data);
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();

        // 팝업이 뜨면 배경 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 팝업이 닫히면 배경 스크롤 복원
        return () => {
            document.body.style.overflow = '';
        };
    }, [diary_id]);

    const [reportPopupVisible, setReportPopupVisible] = useState(false);

    const handleReportButtonClick = () => {
        setReportPopupVisible(true);
    };

    const handleCloseReportPopup = () => {
        setReportPopupVisible(false);
    };

    if (loading) return <div className="sea-popup">Loading...</div>;
    if (error) return <div className="sea-popup">{error}</div>;

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const newCommentData = {
                user_nick: currentUserProfile.user_nick,
                comment_text: newComment,
                diary_id: diary_id,
            };

            try {
                const response = await axios.post(`/comments/${diary_id}/comments`, newCommentData);
                const createdComment = response.data;
                setComments((prevComments) => [...prevComments, createdComment]);
                setNewComment("");
            } catch (err) {
                setError(err.message);
            }
        }
    };


    const handleEditClick = (comment_id) => {
        setEditingcomment_id(comment_id);
    };

    const handleEditBlur = async (comment_id) => {
        const commentEl = commentRefs.current[comment_id];
        if (commentEl) {
            const updatedComment = {
                ...comments.find(comment => comment.comment_id === comment_id),
                comment_text: commentEl.innerText,
            };

            try {
                const response = await axios.put(`/comments/${diary_id}/comments/${comment_id}`, updatedComment);
    
                if (response.status === 200) {
                    setComments(comments.map(comment =>
                        comment.comment_id === comment_id ? updatedComment : comment
                    ));
                } else {
                    throw new Error('Failed to update comment');
                }
            } catch (err) {
                setError(err.message);
            }
        }
        setEditingcomment_id(null);
    };

    const handleDeleteClick = async (comment_id) => {
        try {
            const response = await fetch(`/comments/${comment_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            setComments(comments.filter(comment => comment.comment_id !== comment_id));
        } catch (err) {
            setError(err.message);
        }
    };

    const hasComments = comments.length > 0;
    const showPlaceSection = todayPlace?.cate_num !== undefined && todayPlace?.cate_num !== null;

    const toggleLike = async (e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(`/diaries/${diary_id}/like`, { liked: !liked });
            if (response.status === 200) {
                setLiked(!liked);
            }
        } catch (error) {
            console.error('Failed to update like status', error);
        }
    };


    const EmptyHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7D9FE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const FilledHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#7D9FE3" stroke="#7D9FE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    return (
        <div>
            <div className="sea-popup" onClick={handleBackgroundClick}>
                <div className="sea-popup__content">
                    <div className='sea-popup__header'>
                        <div className='sea-popup__header-left'>
                            {diary?.user?.profile && (
                                <>
                                    <img src={diary.user.profile.profile_img} alt="Diary Author" className="sea-popup__author-profile-image" />
                                    <p className="sea-popup__author-nickname">{diary.user.user_nick}님</p>
                                </>
                            )}
                        </div>
                        <div className="sea-popup__header-right">
                            <button className="sea-popup__report-button" onClick={handleReportButtonClick}>
                                <img src={sirenIcon} alt="Report" />
                            </button>
                            <span className="sea-popup__like-button" onClick={toggleLike}>
                                {liked ? <FilledHeart /> : <EmptyHeart />}
                            </span>
                        </div>
                    </div>

                    <div className={`sea-popup__main-content ${!diary?.cate_num ? 'sea-popup__main-content--centered' : ''}`}>
                        {showPlaceSection && (
                            <div className='sea-popup__place-section'>
                                <h2 className="sea-popup__place-title">Today's Place</h2>
                                <div className='sea-popup__container'>
                                    <img src={selectedIcon} alt="Category Icon" className={`sea-popup__category-icon ${getIconClass(todayPlace.cate_num)}`} />
                                    <div className="sea-popup__icon-text">
                                        <div className="sea-popup__icon-emotion">{todayPlace?.today_mood}</div>
                                        <div className="sea-popup__icon-memo">{todayPlace.place_memo}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="sea-popup__diary-section">
                            <div className='sea-popup__title'>
                                <img src={miniseaImage} alt="Mini sea" className="sea-popup__mini-sea-image" />
                                <h1 className='sea-popup__sea'>Today's sea</h1>
                            </div>
                            <div className='sea-popup__title-container'>
                                <p className='sea-popup__diary-title'>{diary.diary_title}</p>
                                <div className="sea-popup__title-line"></div>
                            </div>
                            <div className="sea-popup__diary-content">
                                <p>{diary.diary_content}</p>
                            </div>
                        </div>
                    </div>

                    <div className="sea-popup__comment-input-section">
                        <img src={currentUserProfile.profile_img} alt="User Profile" className="sea-popup__user-profile-image" />                     <input
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="댓글 달기 ..."
                            className="sea-popup__comment-input"
                        />
                        <button onClick={handleCommentSubmit} className="sea-popup__comment-submit-button">댓글 작성</button>
                    </div>

                    <div className={`sea-popup__comments-section ${!hasComments ? 'sea-popup__comments-section--no-comments' : ''}`}>
                        {hasComments ? (
                            comments.map((comment) => (
                                <div key={comment.comment_id} className="sea-popup__comment">
                                    <img src={comment.user.profile.profile_img} alt="Profile" className="sea-popup__comment-profile-image" />
                                    <div className="sea-popup__comment-details">
                                        <p className="sea-popup__comment-nickname">{comment.user.user_nick}님</p>
                                        <p
                                            className={`sea-popup__comment-content ${editingcomment_id === comment.comment_id ? 'sea-popup__comment-content--editable' : ''}`}
                                            contentEditable={editingcomment_id === comment.comment_id}
                                            onBlur={() => handleEditBlur(comment.comment_id)}
                                            ref={(el) => commentRefs.current[comment.comment_id] = el}
                                            suppressContentEditableWarning={true}
                                        >
                                            {comment.comment_text}
                                        </p>
                                    </div>
                                    {comment.user.user_nick === currentUserProfile.user_nick && (
                                        <div className="sea-popup__comment-actions">
                                            {editingcomment_id === comment.comment_id ? (
                                                <button
                                                    className="sea-popup__edit-button"
                                                    onClick={() => setEditingcomment_id(null)}
                                                >
                                                    저장
                                                </button>
                                            ) : (
                                                <button
                                                    className="sea-popup__edit-button"
                                                    onClick={() => handleEditClick(comment.comment_id)}
                                                >
                                                    수정
                                                </button>
                                            )}
                                            <button
                                                className="sea-popup__delete-button"
                                                onClick={() => handleDeleteClick(comment.comment_id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="sea-popup__no-comments-message">첫 번째 댓글을 남겨보세요!</p>
                        )}
                    </div>
                </div>
            </div>
            {reportPopupVisible && <ReportPopup onClose={handleCloseReportPopup} />}
        </div>
    );
};

export default SeaPopup;
