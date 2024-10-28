import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import TodayQuestionPopup from "./todayQuestionPopup";

import '../../assets/css/forestquestion.css';

const ForestQuestion = ({ onBack }) => {
  const location = useLocation();
  const { diary } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [editorData, setEditorData] = useState('');
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [showTodayQuestionPopup, setShowTodayQuestionPopup] = useState(false);
  const [todayQuestionContent, setTodayQuestionContent] = useState('');
  const [todayQuestion, setTodayQuestion] = useState('Question');
  const [question_id, setQuestionId] = useState(null);
  const [initialAnswer, setInitialAnswer] = useState('');
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [diary_id, setDiaryId] = useState(null);  // 변경된 변수
  const editorRef = useRef();

  useEffect(() => {
    const fetchTodayQuestion = async () => {
      if (diary && diary.diary_id) {
        try {
          // 질문 데이터 가져오기
          const questionResponse = await axios.get(`https://api.usdiary.site/questions/${diary.diary_id}`);
          setTodayQuestion(questionResponse.data.question_text); // question_text로 설정
          setQuestionId(questionResponse.data.question_id); // question_id 설정
  
          // 답변 데이터 가져오기
          const answerResponse = await axios.get(`https://api.usdiary.site/contents/questions/${questionResponse.data.question_id}/answers/${diary.diary_id}`);
          setInitialAnswer(answerResponse.data.answer_text || ''); 
          setInitialPhoto(answerResponse.data.answer_photo || null);
          setDiaryId(answerResponse.data.diary_id || null);
        } catch (error) {
          console.error('Error fetching the question or answer:', error);
          setTodayQuestion('질문을 가져오는 데 실패했습니다.');
          setInitialAnswer('');
          setInitialPhoto(null);
        }
      }
    };
  
    fetchTodayQuestion();
  }, [diary]);  

  useEffect(() => {
    const fetchTodayQuestion = async () => {
      try {
        const response = await axios.get('https://api.usdiary.site/questions/random');
        setTodayQuestion(response.data.question);
        setQuestionId(response.data.id);

        // 기존 답변과 사진 가져오기
        const answersResponse = await axios.get(`https://api.usdiary.site/questions/${response.data.id}/answers`);
        const latestAnswer = answersResponse.data[0] || {};
        setInitialAnswer(latestAnswer.answer_text || ''); // 변경된 변수
        setInitialPhoto(latestAnswer.answer_photo || null); // 변경된 변수
        setDiaryId(latestAnswer.diary_id || null);  // 변경된 변수

      } catch (error) {
        console.error('Error fetching the question:', error);
        setTodayQuestion('질문을 가져오는 데 실패했습니다.');
      }
    };

    fetchTodayQuestion();
  }, []);

  const onChangeGetHTML = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://api.usdiary.site/questions', {
        title,
        content: editorData,
        date: selectedDate.toISOString(),
        visibility: selectedDiv,
        user_id: diary.user_id
      });

      alert('문서가 성공적으로 발행되었습니다.');
    } catch (error) {
      console.error('Error submitting the question:', error);
      alert('문서 발행에 실패했습니다.');
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      await axios.patch(`https://api.usdiary.site/questions/${question_id}`, {
        title,
        content: editorData,
      });

      alert('질문이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating the question:', error);
      alert('질문 수정에 실패했습니다.');
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`https://api.usdiary.site/questions/${question_id}`);

      alert('질문이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting the question:', error);
      alert('질문 삭제에 실패했습니다.');
    }
  };

  const handleUpdateAnswer = async () => {
    try {
      const formData = new FormData();
      formData.append('answer_text', initialAnswer);  // 변경된 변수
      if (initialPhoto) {
        formData.append('answer_photo', initialPhoto);  // 변경된 변수
      }

      await axios.patch(`https://api.usdiary.site/contents/questions/${question_id}/answers/${diary_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('답변이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating the answer:', error);
      alert('답변 수정에 실패했습니다.');
    }
  };

  const handleDeleteAnswer = async () => {
    try {
      await axios.delete(`https://api.usdiary.site/contents/questions/${question_id}/answers/${diary_id}`);  // 변경된 API 경로

      alert('답변이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting the answer:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  useEffect(() => {
    const savedAnswer = localStorage.getItem('todayAnswer');

    // savedAnswer가 존재하는지 확인
    const answerToShow = savedAnswer || (initialAnswer ? initialAnswer : '답변이 없습니다.');

    setTodayQuestionContent(
      `<div class="today-question-text">${todayQuestion}</div><div class="today-answer-text">${answerToShow}</div>`
    );
  }, [showTodayQuestionPopup, todayQuestion, initialAnswer]);


  useEffect(() => {
    if (showTodayQuestionPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showTodayQuestionPopup]);

  const handleTodayQuestionButtonClick = () => {
    setShowTodayQuestionPopup(true);
  };

  const handleTodayQuestionPopupClose = () => {
    setShowTodayQuestionPopup(false);
    setInitialAnswer('');
    setInitialPhoto(null);
  };

  const handleSaveAnswer = () => {
    handleTodayQuestionPopupClose();
  };

  const handleDeleteAnswerFromPopup = () => {
    handleDeleteAnswer();
    handleTodayQuestionPopupClose();
  };

  return (
    <div>
      <div className="forest__forestquestion">
        <div className="forest_back-button" onClick={onBack}>&lt;&lt;&nbsp;&nbsp;Hide</div>
        <div className="forest__forestquestion__check">
          <div className="forest__forestquestion__check-title">
            <div className="forest__forestquestion__check-title-name">Today's Question</div>
            <div
              className={`forest__forestquestion__check-title-plusbtn ${diary ? 'disabled' : ''}`}
              onClick={!diary ? handleTodayQuestionButtonClick : undefined} // diary가 없을 때만 클릭 이벤트 활성화
            >
              +
            </div>
          </div>
          <div className="forest__forestquestion__check-today-question">
            <div className="today-question-box">
              <div className="today-question-content" dangerouslySetInnerHTML={{ __html: todayQuestionContent }}></div>
              {initialPhoto && (
                <div className="forest__forestquestion__check-today-photo-box">
                  <img src={initialPhoto} alt="answer" className="forest__forestquestion__check-today-photo" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTodayQuestionPopup && (
        <TodayQuestionPopup
          question={todayQuestion}
          question_id={question_id}
          initialAnswer={initialAnswer}
          initialPhoto={initialPhoto}
          onClose={() => setShowTodayQuestionPopup(false)}
          onDelete={handleDeleteAnswer}
        />
      )}
    </div>
  );
};

export default ForestQuestion;
