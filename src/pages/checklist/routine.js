import React, { useState, useEffect } from 'react';
import '../../assets/css/checklist.css';
import right_arrow from '../../assets/images/right_arrow.png';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { PropTypes } from 'prop-types';

const Routine = ({ onClose, onArrowClick, onSubmit }) => {
  const [routines, setRoutines] = useState([]);
  const [signId, setSignId] = useState(null);

  // 현재 날짜 기반으로 루틴 데이터 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setSignId(decodedToken.signId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // 날짜를 'YYYY-MM-DD' 형식으로 가져옴
    const currentDate = new Date().toISOString().split('T')[0];

    // 루틴 데이터 GET 요청
    const fetchRoutines = async () => {
      try {
        const response = await axios.get(`https://api.usdiary.site/contents/routines`, {
          params: {
            date: currentDate
          }
        });
        setRoutines(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.error('루틴을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchRoutines();
  }, []);

  // 새로운 루틴 항목 추가 (3개까지만)
  const handleAddRoutine = () => {
    if (routines.length < 3) {
      const updatedRoutines = [...routines, { description: '', is_completed: false }];
      setRoutines(updatedRoutines);
    }
  };

  // 루틴 제목과 내용 입력시 업데이트
  const handleRoutineChange = (index, field, value) => {
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? { ...routine, [field]: value } : routine
    );
    setRoutines(updatedRoutines);
  };

  // 루틴 토글 상태 변경
  const handleToggleChange = (index) => {
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? { ...routine, toggle: !routine.toggle } : routine
    );
    setRoutines(updatedRoutines);
  };

  // 루틴 삭제
  const handleDeleteRoutine = (index) => {
    const updatedRoutines = routines.filter((_, i) => i !== index);
    setRoutines(updatedRoutines);
  };

  // 저장버튼 클릭시 루틴 상태 저장
  const handleSave = async () => {
    if (!signId) {
      alert('signId is missing. Cannot save routines.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    try {
      for (const routine of routines) {
        const routineData = {
          sign_id: signId,
          description: routine.description,
          is_completed: routine.is_completed,
          date: currentDate
        };
        await axios.post('https://api.usdiary.site/contents/routines', routineData);
      }
      alert('루틴이 성공적으로 저장되었습니다.');
      onSubmit(routines);
    } catch (error) {
      console.error('루틴을 저장하는 데 실패했습니다:', error);
      alert('루틴을 저장하는 데 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="ck-popup-overlay">
      <div className="ck-popup-background">
        <div className="ck-popup-content">
          <div className="ck-popup-header">
            <h2>Check List</h2>
            <button className="ck-popup-close" onClick={onClose}>X</button>
          </div>
          <div className="routine">
            <div className="routine-top">
              <div className="routine-top-title">
                <div className="routine-top-title-circle"></div>
                <div className="routine-top-title-name">Routine</div>
              </div>
              <img
                src={right_arrow}
                className="routine-arrow"
                alt="right_arrow"
                onClick={onArrowClick}
              />
            </div>
            <hr />
            <div className="routine-middle">
              {routines.map((routine, index) => (
                <div className="routine-middle-box" key={index}>
                  <div className="routine-middle-box-1">
                    <input
                      type="checkbox"
                      id={`toggle-${index}`}
                      hidden
                      checked={routine.toggle}
                      onChange={() => handleToggleChange(index)}
                    />
                    <label htmlFor={`toggle-${index}`} className="routine-middle-box-toggleSwitch">
                      <span className="routine-middle-box-toggleButton"></span>
                    </label>
                  </div>
                  <div className="routine-middle-box-2">
                    <input
                      className="routine-middle-box-title"
                      type="text"
                      placeholder="Routine"
                      value={routine.title || ""}
                      onChange={(e) => handleRoutineChange(index, 'title', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div className="routine-middle-box-3">
                    <input
                      className="routine-middle-box-content"
                      type="text"
                      placeholder="내용을 입력하시오."
                      value={routine.description || ''}
                      onChange={(e) => handleRoutineChange(index, 'description', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div
                    className="routine-middle-box-delete"
                    onClick={() => handleDeleteRoutine(index)}
                  >
                    삭제
                  </div>
                </div>
              ))}
              {routines.length < 3 && (
                <div className="routine-middle-plusbtn" onClick={handleAddRoutine}>
                  루틴 추가하기
                </div>
              )}
            </div>
            <div className="routine-savebtn" onClick={handleSave}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Routine.propTypes = {
  onClose: PropTypes.func.isRequired,
  onArrowClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Routine;

export const deleteRoutine = async (routine_id) => {
  try {
    await axios.delete(`https://api.usdiary.site/contents/routines/${routine_id}`);
  } catch (error) {
    console.error('Failed to delete routine:', error);
    throw error;
  }
};

export const updateRoutine = async (routine_id, routine) => {
  try {
    const response = await axios.put(`https://api.usdiary.site/contents/routines/${routine_id}`, routine);
    return response.data;
  } catch (error) {
    console.error('Failed to update routine:', error);
    throw error;
  }
};
