import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/forestquestion.css';

const TodayQuestionPopup = ({ onClose, question_id, initialAnswer, initialPhoto, onDelete }) => {
  const [question, setQuestion] = useState(null);
  const [answer_text, setAnswer] = useState(initialAnswer || '');  // 변경된 변수
  const [answer_photo, setPhoto] = useState(initialPhoto || null);  // 변경된 변수
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTodayQuestion = async () => {
      try {
        const response = await axios.get('https://api.usdiary.site/contents/questions/today', {
          params: { date: new Date().toISOString().split('T')[0] }  // Format as YYYY-MM-DD
        });
        setQuestion(response.data.data.question_text);
      } catch (error) {
        console.error('Error fetching today’s question:', error);
        alert('질문을 불러오는 데 실패했습니다.');
      }
    };
    fetchTodayQuestion();
  }, []);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('answer_text', answer_text);
      if (answer_photo) {
        formData.append('answer_photo', answer_photo);
      }

      const date = new Date().toISOString().split('T')[0];

      const response = await axios.post(`https://api.usdiary.site/contents/answers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // Add the token from storage
        },
        params: { date } // Optional date parameter
      });

      if (response.status === 201) {
        alert('답변이 성공적으로 저장되었습니다.');
        onClose();
      }
    } catch (error) {
      console.error('Error saving the answer:', error);
      if (error.response) {
        if (error.response.status === 400) {
          alert('이미 오늘의 질문에 답변을 등록했습니다.');
        } else if (error.response.status === 404) {
          alert('해당 날짜의 질문을 찾을 수 없습니다.');
        } else if (error.response.status === 419) {
          alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
        } else if (error.response.status === 500) {
          alert('서버 오류로 인해 답변 등록에 실패했습니다.');
        } else {
          alert('답변 저장에 실패했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://api.usdiary.site/contents/questions/${question_id}/answers`);  // 변경된 API 경로
      alert('답변이 성공적으로 삭제되었습니다.');
      onDelete();
    } catch (error) {
      console.error('Error deleting the answer:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="forestquestion_popup-overlay">
      <div className="forestquestion_popup-background">
        <div className="forestquestion_popup-content">
          <div className="forestquestion_popup-header">
            <h2>Today's Question</h2>
            <button className="forestquestion_popup-close" onClick={onClose}>X</button>
          </div>
          <div className="forestquestion_popup-question-box">
            <div className="forestquestion_popup-question-text">{question || "Loading..."}</div>
            <textarea
              className="forestquestion_popup-answer-box"
              value={answer_text}
              onChange={handleAnswerChange}
            />
            <input
              type="file"
              className="forestquestion_popup-photo-input"
              accept="image/*"
              onChange={handlePhotoChange}
              ref={fileInputRef}
            />
            {answer_photo && <img src={answer_photo} className="forestquestion_popup-photo-display" alt="selected" />}
            <button className="forestquestion_popup-save-button" onClick={handleSave}>저장</button>
            <button className="forestquestion_popup-delete-button" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayQuestionPopup;
