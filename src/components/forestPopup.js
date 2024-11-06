import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/forestPopup.css';
import miniTreeImage from '../assets/images/minitree.png';
import sirenIcon from '../assets/images/siren_forest.png';
import axios from 'axios';
import ReportPopup from './reportPopup';
import { jwtDecode } from 'jwt-decode';
import { Viewer } from '@toast-ui/react-editor';
import defaultImage from '../assets/images/default.png';
import MoonerPopup from '../pages/mypage/follow/moonerPopup'

const ForestPopup = ({ diary_id, onClose }) => {
    const [diary, setDiary] = useState(null);
    const [comments, setComments] = useState([]);
    const [questionData, setQuestionData] = useState(null);
    const [answerData, setAnswerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editingcomment_id, setEditingcomment_id] = useState(null);
    const commentRefs = useRef({});
    const [liked, setLiked] = useState(false);
    const [userProfile, setUserProfile] = useState({ user_nick: '', profile_img: '' });
    const [isMoonerPopupOpen, setIsMoonerPopupOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.user_id; // 토큰에서 user_id 추출

            const fetchUserProfile = async () => {
                try {
                    const response = await axios.get(`/mypages/profiles/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // 응답 데이터에서 user_nick과 profile_img를 설정
                    const profileData = response.data.data;
                    setUserProfile({
                        user_nick: profileData.user_nick,
                        profile_img: profileData.profile_img,
                        user_tendency: profileData.user_tendency
                    });
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };

            fetchUserProfile();
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchDiaryData = async () => {
            try {
                const response = await axios.get(`/diaries/${diary_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDiary(response.data.data.diary);
                console.log('Diary Data:', response.data.data);
            } catch (error) {
                const message = error.response?.status === 404
                    ? '일기를 찾을 수 없습니다.'
                    : '일기 데이터를 불러오는 데 실패했습니다.';
                setError(message);
                console.error('Error fetching diary data:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDiaryData();
    }, [diary_id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchQuestionData = async () => {
            try {
                const response = await axios.get('/contents/questions/today', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    timeout: 10000,
                });
                const data = response.data?.data;
                setQuestionData(data || null);
                console.log('Question Data:', data);
            } catch (error) {
                const message = error.code === 'ECONNABORTED'
                    ? '서버 응답이 지연되었습니다. 잠시 후 다시 시도해주세요.'
                    : '오늘의 질문을 불러오는 데 실패했습니다.';
                setError(message);
                console.error("Error fetching today's question:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionData();
    }, [diary_id]);

    useEffect(() => {
        if (!questionData?.question_id) {
            setAnswerData(null);
            return;
        }

        const token = localStorage.getItem('token');
        const fetchAnswerData = async (answer_id) => {
            try {
                const response = await axios.get(`/contents/questions/${questionData.question_id}/answers/${answer_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data?.data;

                if (data) {
                    setAnswerData({
                        answer_text: data.answer_text,
                        answer_photo: data.answer_photo,
                        question: data.question,
                    });
                    console.log('Answer Data:', data);
                } else {
                    setAnswerData(null); // 데이터가 없을 때 빈 상태로 설정
                    console.log('Answer Data:', data);
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setAnswerData(null); // 답변을 찾을 수 없는 경우 빈 상태로 설정
                    console.error('Answer not found:', error);
                } else {
                    console.error('Error fetching answer data:', error); // 서버 오류는 콘솔에만 표시
                }
            } finally {
                setLoading(false);
            }
        };

        if (questionData.answer_id) {
            fetchAnswerData(questionData.answer_id);
        } else {
            setAnswerData([]);
        }
    }, [questionData]);


    // Comments data fetch
    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchComments = async () => {
            try {
                // 모든 댓글을 가져오는 엔드포인트
                const response = await axios.get(`/diaries/${diary_id}/comments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const commentsData = response.data?.data || [];
                setComments(commentsData);
                console.log('Comments Data:', commentsData);

            } catch (error) {
                const message = error.code === 'ECONNABORTED'
                    ? '서버 응답이 지연되었습니다. 잠시 후 다시 시도해주세요.'
                    : '댓글을 불러오는 데 실패했습니다.';
                setError(message);
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [diary_id]);

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
                content: newComment, // 서버가 기대하는 필드명에 맞춤
            };

            try {
                const token = localStorage.getItem('token'); // JWT 토큰 가져오기

                // 서버에 댓글 요청
                const response = await axios.post(`/diaries/${diary_id}/comments`, newCommentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // 상태 코드가 201일 때만 댓글 목록에 추가
                if (response.status === 201) {
                    const newCommentWithUser = {
                        ...response.data.data.comment,
                        User: {
                            user_nick: userProfile?.user_nick,
                            Profile: {
                                profile_img: userProfile?.profile_img,
                            },
                        },
                    };

                    setComments(prevComments => [...prevComments, newCommentWithUser]);
                    setNewComment("");
                    console.log(response.data.message); // 댓글 생성 성공 메시지 로그
                } else {
                    setError('Failed to submit comment');
                    console.error('Unexpected response status:', response.status);
                }
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 419) {
                        setError('Token has expired');
                    } else if (err.response.status === 404) {
                        setError(err.response.data.message);
                    } else {
                        setError('Failed to submit comment');
                    }
                    console.error('Server response error:', err.response.data);
                } else {
                    setError('Failed to submit comment');
                    console.error('Error submitting comment:', err);
                }
            }
        }
    };

    const [reportPopupVisible, setReportPopupVisible] = useState(false);

    const handleReportButtonClick = () => {
        setReportPopupVisible(true);
    };

    const handleCloseReportPopup = () => {
        setReportPopupVisible(false);
    };

    if (loading) return <div className="diary-popup">Loading...</div>;
    if (error) return <div className="diary-popup">{error}</div>;


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
                await axios.put(`/comments/${diary_id}/comments/${comment_id}`, updatedComment);
                setComments(comments.map(comment => comment.comment_id === comment_id ? updatedComment : comment));
            } catch (err) {
                setError('Failed to update comment');
                console.error(err);
            }
        }
        setEditingcomment_id(null);
    };

    const handleDeleteClick = async (comment_id) => {
        try {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기
            const response = await axios.delete(`/diaries/comments/${comment_id}`, {
                headers: { Authorization: `Bearer ${token}` }, // 토큰 헤더에 추가
            });

            // 상태 코드가 200일 때만 댓글 목록에서 삭제
            if (response.status === 200) {
                setComments(prevComments => prevComments.filter(comment => comment.comment_id !== comment_id));
                console.log('Comment deleted successfully:', comment_id);
                return;
            }

            // 상태 코드가 404일 경우
            if (response.status === 404) {
                setError('Comment not found');
                console.error('Comment not found:', comment_id);
                return;
            }

            // 예상치 못한 상태 코드
            setError('Failed to delete comment');
            console.error('Unexpected response status:', response.status);

        } catch (err) {
            setError('Failed to delete comment');
            console.error('Error deleting comment:', err);
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const FilledHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#D6E8C0" stroke="#9FC393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    // MoonerPopup 열기 핸들러
    const handleOpenMoonerPopup = () => {
        setIsMoonerPopupOpen(true);
    };

    // MoonerPopup 닫기 핸들러
    const handleCloseMoonerPopup = () => {
        setIsMoonerPopupOpen(false);
    };

    // follower 데이터 구성
    const follower = {
        friend_profile_img: diary?.User?.Profile?.profile_img || defaultImage,
        friend_nick: diary?.User?.user_nick || 'User',
        user_tendency: diary?.User?.user_tendency
    };

    return (
        <div>
            <div className="forest-popup" onClick={handleBackgroundClick}>
                <div className="forest-popup__content">
                    <div className='forest-popup__header'>
                        <div className='forest-popup__header-left' onClick={handleOpenMoonerPopup}>
                            <img src={diary?.User?.Profile?.profile_img || defaultImage} alt={`${diary?.User?.user_nick || 'User'}'s profile`} className="forest-popup__author-profile-image" />
                            <p className="forest-popup__author-nickname">{diary?.User?.user_nick || 'User'}님</p>
                        </div>
                        {/* MoonerPopup 컴포넌트를 조건부로 렌더링 */}
                        {isMoonerPopupOpen && (
                            <MoonerPopup follower={follower} onClose={handleCloseMoonerPopup} />
                        )}
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
                                {Array.isArray(answerData) && answerData.map((answer) => (
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
                                <p className='forest-popup__diary-title'>{diary?.diary_title}</p>
                                <div className="forest-popup__title-line"></div>
                            </div>
                            <div className="forest-popup__diary-content">
                                <Viewer initialValue={diary?.diary_content || ""} />
                            </div>
                        </div>
                    </div>

                    <div className="forest-popup__comment-input-section">
                        <img src={userProfile.profile_img} alt="User Profile" className="forest-popup__user-profile-image" />
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
                            Array.isArray(comments) && comments.map((comment) => (
                                <div key={comment.comment_id} className="forest-popup__comment">
                                    <img
                                        src={comment.User?.Profile?.profile_img || ''}
                                        alt={`${comment.User?.user_nick || 'User'}'s profile`}
                                        className="forest-popup__comment-profile-image"
                                    />
                                    <div className="forest-popup__comment-details">
                                        <p className="forest-popup__comment-nickname">
                                            {comment.User?.user_nick ? `${comment?.User?.user_nick}님` : 'Anonymous'}
                                        </p>
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
                                    {comment.User?.user_nick === userProfile.user_nick && (
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
