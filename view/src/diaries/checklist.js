import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import '../assets/css/login.css';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';

import '../assets/css/checklist.css';
import city from '../assets/images/city.png';
import left_arrow from '../assets/images/left_arrow.png';
import right_arrow from '../assets/images/right_arrow.png';
import todays_check from '../assets/images/Todays_Check_city.png';

// 팝업 컴포넌트
const Popup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-background">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Check List</h2>
            <button className="popup-close" onClick={onClose}>X</button>
          </div>
          <div className="popup-routine">
            <div className="popup-routine-top">
              <div className="popup-routine-top-title">
                <div className="popup-routine-top-title-circle"></div>
                <div className="popup-routine-top-title-name">Routine</div>
              </div>
              <img src={right_arrow} className="popup-routine-top-arrow" alt="right_arrow"/>
            </div>
            <hr/>
            <div className="popup-routine-middle">
              <div className="popup-routine-middle-box">
                <div className="popup-routine-middle-box-category">category</div>
                <div className="popup-routine-middle-box-title">Brainstorming</div>
                <div className="popup-routine-middle-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="popup-routine-middle-plusbtn">루틴 추가하기</div>
            </div>
            <div className="popup-routine-savebtn">저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckList = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [title, setTitle] = useState('제목'); // 제목
  const [editorData, setEditorData] = useState(''); // 에디터 내용
  const [selectedDiv, setSelectedDiv] = useState(0); // 공개범위
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부
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

  useEffect(() => {
    // 팝업 열렸을 때 스크롤 비활성화
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // 컴포넌트가 언마운트되거나 팝업 닫힐 때 스크롤을 다시 활성화
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPopup]);

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
      <div className="city__checklist">
        {/* 체크리스트 */}
        <div className="city__checklist__check">
          {/* 체크리스트 제목 */}
          <div className="city__checklist__check-title">
            <div className="city__checklist__check-title-name">Check List</div>
            <div
              className="city__checklist__check-title-plusbtn"
              onClick={() => setShowPopup(true)} // 팝업 표시
            >
              +
            </div>
          </div>
          {/* 체크리스트 루틴 */}
          <div className="city__checklist__check-routine">
            <div className="city__checklist__check-routine-top">
              <div className="city__checklist__check-routine-top-circle"></div>
              <div className="city__checklist__check-routine-top-name">Routine</div>
              <div className="city__checklist__check-routine-top-num">1</div>
            </div>
            <hr/>
            <div className="city__checklist__check-routine-bottom">
              <div className="city__checklist__check-routine-bottom-box">
                <div className="city__checklist__check-routine-bottom-box-category">category</div>
                <div className="city__checklist__check-routine-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-routine-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="city__checklist__check-routine-bottom-box">
                <div className="city__checklist__check-routine-bottom-box-category">category1</div>
                <div className="city__checklist__check-routine-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-routine-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
            </div>
          </div>
          {/* 체크리스트 투두 */}
          <div className="city__checklist__check-todo">
            <div className="city__checklist__check-todo-top">
              <div className="city__checklist__check-todo-top-circle"></div>
              <div className="city__checklist__check-todo-top-name">To Do</div>
              <div className="city__checklist__check-todo-top-num">3</div>
            </div>
            <hr/>
            <div className="city__checklist__check-todo-bottom">
              <div className="city__checklist__check-todo-bottom-box">
                <div className="city__checklist__check-todo-bottom-box-category">category</div>
                <div className="city__checklist__check-todo-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-todo-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="city__checklist__check-todo-bottom-box">
                <div className="city__checklist__check-todo-bottom-box-category">category1</div>
                <div className="city__checklist__check-todo-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-todo-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="city__checklist__check-todo-bottom-box">
                <div className="city__checklist__check-todo-bottom-box-category">category2</div>
                <div className="city__checklist__check-todo-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-todo-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="city__checklist__check-todo-bottom-box">
                <div className="city__checklist__check-todo-bottom-box-category">category3</div>
                <div className="city__checklist__check-todo-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-todo-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="city__checklist__check-todo-bottom-box">
                <div className="city__checklist__check-todo-bottom-box-category">category4</div>
                <div className="city__checklist__check-todo-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-todo-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
              <div className="city__checklist__check-todo-bottom-box">
                <div className="city__checklist__check-todo-bottom-box-category">category5</div>
                <div className="city__checklist__check-todo-bottom-box-title">Brainstorming</div>
                <div className="city__checklist__check-todo-bottom-box-content">Brainstorming brings team members' diverse experience into play.</div>
              </div>
            </div>
          </div>       
        </div>

        {/* 일기작성 */}
        <div className="city__checklist__diary">
          <div className="city__checklist__diary-top">
            <img src={city} className="city__checklist__diary-top-image" alt="city" />
            <div className="city__checklist__diary-top-title">Today's City</div>
          </div>
          <div className="city__checklist__diary-date">
            <img src={left_arrow} className="city__checklist__diary-date-arrow" alt="left_arrow" onClick={() => changeDate('prev')}/>
            <div className="city__checklist__diary-date-container">
              {getDaysArray().map((day, i) => (
                <div
                  key={i}
                  className={`city__checklist__diary-date-round ${day.toDateString() === selectedDate.toDateString() ? 'city__checklist__diary-date-round--today' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {getDay(day)} {/* 일(day)만 표시 */}
                </div>
              ))}
            </div>
            <img src={right_arrow} className="city__checklist__diary-date-arrow" alt="right_arrow" onClick={() => changeDate('next')}/>
          </div>
          <div className="city__checklist__diary-title-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {title}
          </div>
          <div className="city__checklist__diary-another">
            <div className="city__checklist__diary-another-reveal">
              {['only', 'subscribe', 'all'].map((className, index) => (
                <div
                  key={index}
                  className={`city__checklist__diary-another-reveal-btn city__checklist__diary-another-reveal-btn--${className} ${selectedDiv === index ? 'city__checklist__diary-another-reveal-btn--selected' : ''}`}
                  onClick={() => handleDivClick(index)}
                >
                  {className}
                </div>
              ))}
            </div>
            <div className="city__checklist__diary-another-submit" onClick={handleSubmit}>발행</div>
          </div>
          <div className="city__checklist__diary-texts">
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

      {/* 팝업 */}
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default CheckList;