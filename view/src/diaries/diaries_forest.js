import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import '../assets/css/login.css';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';


import '../assets/css/diaries_forest.css';
import tree from '../assets/images/tree.png';
import left_arrow from '../assets/images/left_arrow.png';
import right_arrow from '../assets/images/right_arrow.png';
import todays_question from '../assets/images/Todays_Question_forest.png';

const ForestDiary = () => {

  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [title, setTitle] = useState('제목'); // 제목
  const [editorData, setEditorData] = useState(''); // 에디터 내용
  const [selectedDiv, setSelectedDiv] = useState(0); // 공개범위
  const editorRef = useRef(); // 에디터 ref

  // 날짜 변경 함수
  const changeDate = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else if (direction === 'next') {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  // 선택된 날짜로 currentDate 업데이트
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date)); // 클릭한 날짜를 가운데로 위치
  };

  // 제목 수정 핸들러
  const handleTitleChange = (event) => {
    setTitle(event.target.innerText);
  };

  // 공개범위 클릭 핸들러
  const handleDivClick = (index) => {
    setSelectedDiv(index);
  };

  // 에디터 내용 HTML로 변환하여 상태에 저장
  const onChangeGetHTML = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data);
    }
  };

  // 제출 핸들러
  const handleSubmit = () => {
    console.log("발행 시 날짜: ", selectedDate);
    console.log("발행 시 제목: ", title);
    console.log("발행 시 공개범위: ", selectedDiv);
    console.log("발행 시 에디터 내용: ", editorData);
  };

  // 초기 렌더링 시 에디터 초기화
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML(''); // 에디터 초기화
    }
  }, []);

  // 현재 날짜를 문자열로 반환
  const getDay = (date) => date.getDate(); // 일(day)만 반환

  // 오늘 날짜를 기준으로 7일 간의 날짜 배열 생성
  const getDaysArray = () => {
    const today = new Date(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - 3 + i); // 오늘 날짜를 가운데로 위치시키기 위해 조정
      return day;
    });
  };
  
  return (
    <div className="wrap">
      {/* 메뉴 */}
      <div className="menu">
        {/* 로고 */}
        <div className="logo">
          <img src={Logo_US} className="logo_us" alt="Logo US" />
          <img src={Logo_EARTH} className="logo_earth" alt="Logo Earth" />
        </div>
        {/* 버튼 */}
        <div className="button">
          <div className="btn" id="home">HOME</div>
          <div className="btn" id="diary">DIARY</div>
          <div className="btn" id="map">MAP</div>
          <div className="btn" id="profile">PROFILE</div>
          <div className="btn" id="alarm">
            <img src={alarm_white} className="alarm_white" alt="Alarm White"/>
            <img src={alarm_black} className="alarm_black" alt="Alarm Black"/>
          </div>
        </div>
      </div>
      
      {/* 다이어리 */}
      <div className="forest">
        {/* 오늘의 질문 */}
        <div className="forest__question">
          <img src={todays_question} className="forest__question-image" alt="todays_question"/>
        </div>
        {/* 일기작성 */}
        <div className="forest__diary">
          <img src={tree} className="forest__diary-tree" alt="tree" />
          <div className="forest__diary-title">Today's Forest</div>
          <div className="forest__diary-date">
            <img src={left_arrow} className="forest__diary-date-arrow" alt="left_arrow" onClick={() => changeDate('prev')}/>
            <div className="forest__diary-date-container">
              {getDaysArray().map((day, i) => (
                <div
                  key={i}
                  className={`forest__diary-date-round ${day.toDateString() === selectedDate.toDateString() ? 'forest__diary-date-round--today' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {getDay(day)} {/* 일(day)만 표시 */}
                </div>
              ))}
            </div>
            <img src={right_arrow} className="forest__diary-date-arrow" alt="right_arrow" onClick={() => changeDate('next')}/>
          </div>
          <div className="forest__diary-title-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {title}
          </div>
          <div className="forest__diary-actions">
            <div className="forest__diary-actions-reveal">
              {['only', 'subscribe', 'all'].map((className, index) => (
                <div
                  key={index}
                  className={`forest__diary-actions-reveal-btn forest__diary-actions-reveal-btn--${className} ${selectedDiv === index ? 'forest__diary-actions-reveal-btn--selected' : ''}`}
                  onClick={() => handleDivClick(index)}
                >
                  {className}
                </div>
              ))}
            </div>
            <div className="forest__diary-submit" onClick={handleSubmit}>발행</div>
          </div>
          <div className="forest__diary-texts">
            <Editor
              toolbarItems={[
                // 툴바 옵션 설정
                ['heading', 'bold', 'italic', 'strike'],
                ['image', 'link']
              ]}
              height="100%" // 에디터 창 높이
              initialEditType="wysiwyg" // 기본 에디터 타입 (or wysiwyg)
              ref={editorRef} // ref 참조
              onChange={onChangeGetHTML} // onChange 이벤트
              hideModeSwitch={true} // Markdown과 WYSIWYG 탭이 사라짐 
            />
          </div>
        </div>
      </div>
    </div>
    
  );
};



export default ForestDiary;