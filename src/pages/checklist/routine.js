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

    const currentDate = new Date().toISOString().split('T')[0];

    const fetchRoutines = async () => {
      const token = localStorage.getItem('token'); // 여기서 token을 다시 정의
      try {
        const response = await axios.get(`https://api.usdiary.site/contents/routines`, {
          params: {
            date: currentDate
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Response data:", response.data);
        const fetchedRoutines = Array.isArray(response.data.data) ? response.data.data.slice(0, 3) : [];
        setRoutines(fetchedRoutines.length > 0 ? fetchedRoutines : []);
        console.log("되고 있음?");
      } catch (error) {
        console.error('루틴을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchRoutines();
  }, []);

  // 새로운 루틴 항목 추가 (3개까지만)
  const handleAddRoutine = async () => {
    // 루틴이 3개 미만일 경우에만 추가 가능
    if (routines.length < 3) {
      const date = new Date().toISOString().split('T')[0];
      const newRoutine = {
        routine_title: '임시 제목',  // 제목을 '임시 제목'으로 설정
        description: '',
        is_completed: false,
        date,
      };

      try {
        // 서버에 루틴 추가 요청 (routine_id 제외)
        const response = await axios.post(
          'https://api.usdiary.site/contents/routines',
          newRoutine,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        // 서버에서 반환된 실제 routine_id로 업데이트
        const createdRoutine = response.data;
        setRoutines((prevRoutines) => [
          ...prevRoutines,
          createdRoutine // 실제 routine_id가 포함된 새 루틴 추가
        ]);
        console.log('서버에 루틴 추가 성공:', createdRoutine);
      } catch (error) {
        console.error('새로운 루틴 추가에 실패했습니다:', error);
        if (error.response) {
          console.log('서버 응답:', error.response.data); // 서버에서 반환된 오류 메시지 확인
        }
      }
    } else {
      alert('루틴은 최대 3개까지만 추가할 수 있습니다.');
    }
  };

  // 루틴 수정 함수
  const handleRoutineChange = async (index, field, newValue) => {
    const routineToUpdate = routines[index];

    if (!routineToUpdate || !routineToUpdate.routine_id) {
      console.error('루틴 ID가 정의되지 않았습니다.');
      return;
    }

    const updatedRoutine = { ...routineToUpdate, [field]: newValue };

    // 로컬 상태 업데이트만 하고 서버에 저장하지 않음
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? updatedRoutine : routine
    );
    setRoutines(updatedRoutines);
    console.log("루틴 수정됨:", routineToUpdate.routine_id);
  };

  // 루틴 토글 상태 변경
  const handleToggleChange = (index) => {
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? { ...routine, toggle: !routine.toggle } : routine
    );
    setRoutines(updatedRoutines);
  };

  // 루틴 삭제
  const handleDeleteRoutine = async (index) => {
    const routineToDelete = routines[index];
    if (!routineToDelete || !routineToDelete.routine_id) {
      console.error('삭제할 루틴이 없습니다.');
      return;
    }

    try {
      // 서버에 DELETE 요청을 보내서 루틴 삭제
      await axios.delete(`https://api.usdiary.site/contents/routines/${routineToDelete.routine_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 요청이 성공하면 로컬 상태에서 삭제
      const updatedRoutines = routines.filter((routine, i) => i !== index);
      setRoutines(updatedRoutines);
      console.log("루틴 삭제 성공:", routineToDelete.routine_id);
    } catch (error) {
      console.error('루틴 삭제에 실패했습니다:', error);
    }
  };

  // 루틴 저장 함수
  const handleSave = async () => {
    const currentDate = new Date().toISOString().split('T')[0];

    // 유효성 검사: 루틴 제목과 설명이 비어 있지 않은지 확인
    const invalidRoutines = routines.filter(routine => !routine.routine_title || !routine.description);
    if (invalidRoutines.length > 0) {
      alert('루틴 제목과 설명을 모두 입력해 주세요.');
      return; // 필수 항목이 비어 있으면 저장하지 않음
    }

    try {
      // 수정된 루틴만 서버에 저장
      for (const routine of routines) {
        const routineData = {
          routine_title: routine.routine_title,
          description: routine.description,
          is_completed: routine.is_completed,
          date: currentDate,
        };

        // 루틴 데이터가 이미 존재하면 PATCH로 수정, 없으면 POST로 추가
        if (routine.routine_id) {
          // 이미 존재하는 루틴 수정
          await axios.patch(`https://api.usdiary.site/contents/routines/${routine.routine_id}`, routineData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } else {
          // 새로운 루틴 추가
          await axios.post('https://api.usdiary.site/contents/routines', routineData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        }
      }

      alert('루틴이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('루틴을 저장하는 데 실패했습니다:', error.response ? error.response.data.data : error.message);
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
                      value={routine.routine_title || ""}
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
    return response.data.data
  } catch (error) {
    console.error('Failed to update routine:', error);
    throw error;
  }
};
