import React, { useState, useEffect } from 'react';
import '../../assets/css/checklist.css';
import right_arrow from '../../assets/images/right_arrow.png';
import axios from 'axios';

// API 호출 함수들
const getTodos = async () => {
  try {
    const response = await axios.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw error;
  }
};

const postTodos = async (todos) => {
  try {
    const response = await axios.post('/todos', { todos });
    return response.data;
  } catch (error) {
    console.error('Failed to post todos:', error);
    throw error;
  }
};

const Todo = ({ onClose, onArrowClick, onSubmit }) => {
  const [todos, setTodos] = useState([]);

  // Fetch todos when component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data.length > 0 ? data : []);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = () => {
    if (todos.length < 5) {
      setTodos([...todos, { toggle: false, title: '', content: '' }]);
    }
  };

  const handleTodoChange = (index, field, value) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, [field]: value } : todo
    );
    setTodos(updatedTodos);
  };

  const handleToggleChange = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, toggle: !todo.toggle } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  // 저장버튼 클릭시 루틴 상태 저장
  const handleSave = async () => {
    onSubmit(todos);
    try {
      const response = await postTodos(todos);
      console.log('투두가 서버에 저장되었습니다:', response);
      onSubmit(todos); // 체크리스트에 해당 값 등재
      alert('투두가 성공적으로 저장되었습니다.');

    } catch (error) {
      console.error('투두를 저장하는 데 실패했습니다:', error);
      alert('투두를 저장하는 데 실패했습니다. 다시 시도해주세요.');
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
          <div className="todo">
            <div className="todo-top">
              <div className="todo-top-title">
                <div className="todo-top-title-circle"></div>
                <div className="todo-top-title-name">To Do</div>
              </div>
              <img 
                src={right_arrow} 
                className="todo-top-arrow" 
                alt="right_arrow"
                onClick={onArrowClick} 
              />
            </div>
            <hr />
            <div className="todo-middle">
              {todos.map((todo, index) => (
                <div className="todo-middle-box" key={index}>
                  <div className="todo-middle-box-1">
                    <input 
                      type="checkbox" 
                      id={`toggle-${index}`} 
                      hidden 
                      checked={todo.toggle} 
                      onChange={() => handleToggleChange(index)} 
                    /> 
                    <label htmlFor={`toggle-${index}`} className="todo-middle-box-toggleSwitch">
                      <span className="todo-middle-box-toggleButton"></span>
                    </label>
                  </div>
                  <div className="todo-middle-box-2">
                    <input 
                      className="todo-middle-box-title" 
                      type="text" 
                      placeholder="To Do"
                      value={todo.title}
                      onChange={(e) => handleTodoChange(index, 'title', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div className="todo-middle-box-3">
                    <input 
                      className="todo-middle-box-content" 
                      type="text" 
                      placeholder="내용을 입력하시오."
                      value={todo.content}
                      onChange={(e) => handleTodoChange(index, 'content', e.target.value)}
                    />
                  </div>
                  <div 
                    className="todo-middle-box-delete"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    삭제
                  </div>
                </div>
              ))}
              {todos.length < 5 && (
                <div className="todo-middle-plusbtn" onClick={handleAddTodo}>
                  투두 추가하기
                </div>
              )}
            </div>
            <div className="todo-savebtn" onClick={handleSave}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;

// 투두 관련 API 호출
export const deleteTodo = async (id) => {
  try {
    await axios.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
};

export const updateTodo = async (id, todo) => {
  try {
    const response = await axios.put(`/todos/${id}`, todo);
    return response.data;
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
};
