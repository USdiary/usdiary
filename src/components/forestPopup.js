import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/forestPopup.css';
import miniTreeImage from '../assets/images/minitree.png'
import sirenIcon from '../assets/images/siren_forest.png';
import axios from 'axios';
import ReportPopup from './reportPopup';

const ForestPopup = ({ diary_id, onClose }) => {
    const [diary, setDiary] = useState(null);
    const [comments, setComments] = useState([]);
    const [questionData, setQuestionData] = useState(null);
    const [answerData, setAnswerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState(""); // 새 댓글 상태
    const [editingcomment_id, setEditingcomment_id] = useState(null);
    const commentRefs = useRef({});
    const [liked, setLiked] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState({
        profile_img: '',
        user_nick: ''
    });

    useEffect(() => {
        const fetchDiaryData = async () => {
            try {
                const diaryResponse = await axios.get(`/diaries/${diary_id}`);
                setDiary(diaryResponse.data);
            } catch (err) {
                setError('Failed to fetch diary data');
                console.error(err);
            }
        };

        // Fetch question data
        const fetchQuestionData = async () => {
            try {
                const questionResponse = await axios.get(`/questions/${diary_id}`);
                setQuestionData(questionResponse.data);
            } catch (err) {
                setError('Failed to fetch question data');
                console.error(err);
            }
        };

        // Fetch comments data
        const fetchComments = async () => {
            try {
                const commentsResponse = await axios.get(`/diaries/${diary_id}/comments`);
                setComments(commentsResponse.data);
            } catch (err) {
                setError('Failed to fetch comments');
                console.error(err);
            }
        };

        // Fetch all data
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchDiaryData(),
                fetchQuestionData(),
                fetchComments()

            ]);
            setLoading(false);
        };

        fetchAllData();


        // 팝업이 뜨면 배경 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 팝업이 닫히면 배경 스크롤 복원
        return () => {
            document.body.style.overflow = '';
        };
    }, [diary_id]);

    useEffect(() => {
        if (questionData) {
            const fetchAnswerData = async () => {
                try {
                    const answersResponse = await axios.get(`/answers/${questionData.question_id}`);
                    setAnswerData(answersResponse.data);
                } catch (err) {
                    setError('Failed to fetch answer data');
                    console.error(err);
                }
            };

            fetchAnswerData();
        }
    }, [questionData]);

    useEffect(() => {
        // Fetch initial liked status
        const fetchLikeStatus = async () => {
            try {
                const response = await axios.get(`/diaries/${diary_id}/like`);
                setLiked(response.data.liked);
            } catch (error) {
                console.error('Failed to fetch like status', error);
            }
        };
        fetchLikeStatus();
    }, [diary_id]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/user/profile'); // 사용자 프로필 정보를 가져오는 API 엔드포인트
                setCurrentUserProfile({
                    profileImage: response.data.profile_img,
                    nickname: response.data.user_nick
                });
            } catch (err) {
                console.error('Failed to fetch user profile', err);
            }
        };

        fetchUserProfile();
    }, []);

    const [reportPopupVisible, setReportPopupVisible] = useState(false);

    const handleReportButtonClick = () => {
        setReportPopupVisible(true);
    };

    const handleCloseReportPopup = () => {
        setReportPopupVisible(false);
    };

    if (loading) return <div className="diary-popup">Loading...</div>;
    if (error) return <div className="diary-popup">{error}</div>;

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
                const response = await fetch(`/comments/${diary_id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCommentData),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit comment');
                }

                const createdComment = await response.json();
                setComments([...comments, createdComment]);
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
                const response = await fetch(`/comments/${diary_id}/comments/${comment_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedComment),
                });

                if (!response.ok) {
                    throw new Error('Failed to update comment');
                }

                setComments(comments.map(comment =>
                    comment.comment_id === comment_id ? updatedComment : comment
                ));
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
    const hasAnswers = answerData && answerData.length > 0;

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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9FC393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const FilledHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#D6E8C0" stroke="#9FC393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    return (
        <div>
            <div className="forest-popup" onClick={handleBackgroundClick}>
                <div className="forest-popup__content">
                    <div className='forest-popup__header'>
                        <div className='forest-popup__header-left'>
                            <img src={diary.user.profile.profile_img} alt={`${diary.user.user_nick}'s profile`} className="forest-popup__author-profile-image" />
                            <p className="forest-popup__author-nickname">{diary.user.user_nick}님</p>
                        </div>
                        <div className="forest-popup__header-right">
                            <button className="forest-popup__report-button" onClick={handleReportButtonClick}>
                                <img src={sirenIcon} alt="Report icon" />
                            </button>
                            <span className="forest-popup__like-button" onClick={toggleLike}>
                                {liked ? <FilledHeart /> : <EmptyHeart />}
                            </span>
                        </div>
                    </div>

                    <div className={`forest-popup__main-content ${!hasAnswers ? 'forest-popup__main-content--centered' : ''}`}>
                            <div className="forest-popup__question-section">
                                <h2 className="forest-popup__question-title">Today's Question</h2>
                                <div className="forest-popup__question-content">
                                    <p className="forest-popup__question-text">Q. {questionData?.question_text}</p>
                                    {answerData.map(answer => (
                                        <div key={answer.answer_id}>
                                            <p className="forest-popup__answer-text">{answer.answer_text}</p>
                                            {answer.answer_photo && (
                                                <div className="forest-popup__check-today-photo-box">
                                                    <img src={answer.answer_photo} alt="Today's Question" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        <div className="forest-popup__diary-section">
                            <div className='forest-popup__title'>
                                <img src={miniTreeImage} alt="" className="forest-popup__mini-tree-image" />
                                <h1 className='forest-popup__forest'>Today's Forest</h1>
                            </div>
                            <div className='forest-popup__title-container'>
                                <p className='forest-popup__diary-title'>{diary.diary_title}</p>
                                <div className="forest-popup__title-line"></div>
                            </div>
                            <div className="forest-popup__diary-content">
                                <p>{diary.diary_content}</p>
                            </div>
                        </div>
                    </div>

                    <div className="forest-popup__comment-input-section">
                        <img src={currentUserProfile.profile_img} alt="User Profile" className="forest-popup__user-profile-image" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="댓글 달기 ..."
                            className="forest-popup__comment-input"
                        />
                        <button onClick={handleCommentSubmit} className="forest-popup__comment-submit-button">댓글 작성</button>
                    </div>

                    <div className={`forest-popup__comments-section ${!hasComments ? 'forest-popup__comments-section--no-comments' : ''}`}>
                        {hasComments ? (
                            comments.map((comment) => (
                                <div key={comment.comment_id} className="forest-popup__comment">
                                    <img src={comment.user.profile.profile_img} alt={`${comment.user.user_nick}'s profile`} className="forest-popup__comment-profile-image" />
                                    <div className="forest-popup__comment-details">
                                        <p className="forest-popup__comment-nickname">{comment.user.user_nick}님</p>
                                        <p
                                            className={`forest-popup__comment-content ${editingcomment_id === comment.comment_id ? 'forest-popup__comment-content--editable' : ''}`}
                                            contentEditable={editingcomment_id === comment.comment_id}
                                            onBlur={() => handleEditBlur(comment.comment_id)}
                                            ref={(el) => commentRefs.current[comment.comment_id] = el}
                                            suppressContentEditableWarning={true}
                                        >
                                            {comment.comment_text}
                                        </p>
                                    </div>
                                    {comment.user.user_nick === currentUserProfile.user_nick && (
                                        <div className="forest-popup__comment-actions">
                                            {editingcomment_id === comment.comment_id ? (
                                                <button
                                                    className="forest-popup__edit-button"
                                                    onClick={() => setEditingcomment_id(null)}
                                                >
                                                    저장
                                                </button>
                                            ) : (
                                                <button
                                                    className="forest-popup__edit-button"
                                                    onClick={() => handleEditClick(comment.comment_id)}
                                                >
                                                    수정
                                                </button>
                                            )}
                                            <button
                                                className="forest-popup__delete-button"
                                                onClick={() => handleDeleteClick(comment.comment_id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="forest-popup__no-comments-message">첫 번째 댓글을 남겨보세요!</p>
                        )}
                    </div>
                </div>
            </div>
            {reportPopupVisible && <ReportPopup onClose={handleCloseReportPopup} />}
        </div>
    );

};

export default ForestPopup;
