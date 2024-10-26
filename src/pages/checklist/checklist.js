import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';

import '../../assets/css/checklist.css';

import Routine from './routine';
import Todo from './todo';

import axios from 'axios';

// API 호출 함수들
export const postDiary = async (diary) => {
  try {
    const response = await axios.post('/diaries', diary);
    return response.data;
  } catch (error) {
    console.error('Failed to post diary:', error);
    throw error;
  }
};

export const putRoutine = async (routine_id, updatedRoutine) => {
  try {
    const response = await axios.put(`/routines/${routine_id}`, updatedRoutine);
    return response.data;
  } catch (error) {
    console.error('Failed to update routine:', error);
    throw error;
  }
};

export const deleteRoutine = async (routine_id) => {
  try {
    await axios.delete(`/routines/${routine_id}`);
  } catch (error) {
    console.error('Failed to delete routine:', error);
    throw error;
  }
};

export const putTodo = async (todo_id, updatedTodo) => {
  try {
    const response = await axios.put(`/todos/${todo_id}`, updatedTodo);
    return response.data;
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
};

export const deleteTodo = async (todo_id) => {
  try {
    await axios.delete(`/todos/${todo_id}`);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
};



// 체크리스트 페이지 전체화면 컴포넌트
const CheckList = ({ onBack }) => {
  const location = useLocation();
  const { diary } = location.state || {};

  const [routines, setRoutines] = useState([]); // 초기 루틴 상태
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 다이어리 객체가 있는 경우에만 초기 데이터를 설정
    if (diary) {
      // 루틴과 투두를 초기화
      const fetchRoutinesAndTodos = async () => {
        try {
          const routinesResponse = await axios.get(`/routines?user_id=${diary.user_id}`);
          setRoutines(routinesResponse.data);
          
          const todosResponse = await axios.get(`/todos?diary_id=${diary.diary_id}`);
          setTodos(todosResponse.data);
        } catch (error) {
          console.error('Failed to fetch routines and todos:', error);
        }
      };

      fetchRoutinesAndTodos();
    }
  }, [diary]);


  const [showRoutine, setShowRoutine] = useState(false); // Popup을 Routine으로 변경
  const [showTodo, setShowTodo] = useState(false); // NewPopup을 Todo로 변경

  // 스크롤 잠금
  useEffect(() => {
    if (showRoutine || showTodo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showRoutine, showTodo]);

  // 루틴 팝업 열기 핸들러
  const handleRoutineArrowClick = () => {
    setShowRoutine(false);
    setShowTodo(true);
  };

  // 투두 팝업 열기 핸들러
  const handleTodoArrowClick = () => {
    setShowRoutine(true);
    setShowTodo(false);
  };

  // 팝업 닫기 핸들러
  const handlePopupClose = () => {
    setShowRoutine(false);
    setShowTodo(false);
  };

  // 루틴 제출 핸들러
  const handleRoutineSubmit = async (newRoutines) => {
    try {
      await postDiary(newRoutines);
      const updatedRoutines = await axios.get(`/routines?user_id=${diary.user_id}`);
      setRoutines(updatedRoutines.data);
    } catch (error) {
      console.error('Failed to update routines:', error);
    }
  };

  // 투두 제출 핸들러
  const handleTodoSubmit = async (newTodos) => {
    try {
      await postDiary(newTodos);
      const updatedTodos = await axios.get(`/todos?diary_id=${diary.diary_id}`);
      setTodos(updatedTodos.data);
    } catch (error) {
      console.error('Failed to update todos:', error);
    }
  };

  return (
    <div>
      <div className="city_back-button" onClick={onBack}>&lt;&lt;&nbsp;&nbsp;Hide</div>
      <div className="checklist">
        <div className="checklist-title">
          <div className="checklist-title-name">Check List</div>
          <div
            className="checklist-title-plusbtn"
            onClick={() => diary ? null : setShowRoutine(true)} // diary가 있으면 클릭할 수 없음
            style={{ cursor: diary ? 'not-allowed' : 'pointer', opacity: diary ? 0.5 : 1 }} // 비활성화 스타일
          >
            +
          </div>
        </div>

        <div className="checklist-routine">
          <div className="checklist-routine-top">
            <div className="checklist-routine-top-circle"></div>
            <div className="checklist-routine-top-name">Routine</div>
            <div className="checklist-routine-top-num">{routines.length}</div>
          </div>
          <hr />
          <div className="checklist-routine-bottom">
            {routines.map((routine, index) => (
              <div className="checklist-routine-bottom-box" key={routine.routine_id}>
                <div className="checklist-routine-bottom-box-toggleSwitch">
                  <input
                    type="checkbox"
                    id={`routine-toggle-${index}`}
                    hidden
                    checked={routine.is_completed}
                    readOnly
                  />
                  <label htmlFor={`routine-toggle-${index}`}>
                    <span></span>
                  </label>
                </div>
                <div className="checklist-routine-bottom-box-title">{routine.routine_title}</div>
                <div className="checklist-routine-bottom-box-content">{routine.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="checklist-todo">
          <div className="checklist-todo-top">
            <div className="checklist-todo-top-circle"></div>
            <div className="checklist-todo-top-name">To Do</div>
            <div className="checklist-todo-top-num">{todos.length}</div>
          </div>
          <hr />
          <div className="checklist-todo-bottom">
            {todos.map((todo, index) => (
              <div className="checklist-todo-bottom-box" key={todo.todo_id}>
                <div className="checklist-todo-bottom-box-toggleSwitch">
                  <input
                    type="checkbox"
                    id={`todo-toggle-${index}`}
                    hidden
                    checked={todo.is_completed}
                    readOnly // 읽기 전용으로 설정
                  />
                  <label htmlFor={`todo-toggle-${index}`}>
                    <span></span>
                  </label>
                </div>
                <div className="checklist-todo-bottom-box-title">{todo.todo_title}</div>
                <div className="checklist-todo-bottom-box-content">{todo.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showRoutine && <Routine onClose={handlePopupClose} onArrowClick={handleRoutineArrowClick} onSubmit={handleRoutineSubmit} />}
      {showTodo && <Todo onClose={handlePopupClose} onArrowClick={handleTodoArrowClick} onSubmit={handleTodoSubmit} />}
    </div>
  );
};

export default CheckList;
