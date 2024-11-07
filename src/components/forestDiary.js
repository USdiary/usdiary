import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Viewer, Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';

import tree from '../assets/images/tree.png';
import DateSelector from './dateSelector';
import RevealOptions from './revealOptions';
import DropdownMenu from './dropdownMenu';

const ForestComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { diary } = location.state || {};

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diary_title, setTitle] = useState('');
  const [diary_content, setEditorData] = useState('');
  const [access_level, setSelectedDiv] = useState(0);
  const [diaryData, setDiaryData] = useState(null);
  const [post_photo, setFirstImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef();
  const [error, setError] = useState(null);

  const extractFirstImageUrl = (content) => {
    const imageRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imageRegex);
    return match ? match[1] : null;
  };

  const fetchDiaryData = useCallback(async () => {
    try {
      const response = await axios.get('/diaries', {
        params: { date: selectedDate.toISOString().split('T')[0] }
      });
      setDiaryData(response.data);
      setTitle(response.data.diary_title);
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(response.data.diary_content);
      }
    } catch (error) {
      console.error("Error fetching diary data:", error);
    }
  }, [selectedDate]);


  useEffect(() => {
    if (diary) {
      setTitle(diary.diary_title);
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(diary.diary_content);
      }
      const createdAtDate = new Date(diary.createdAt);
      setSelectedDate(createdAtDate);
      setCurrentDate(createdAtDate);
    } else {
      fetchDiaryData();
    }
  }, [diary]);

  const handleDateClick = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if ([today.toDateString(), yesterday.toDateString()].includes(new Date(date).toDateString())) {
      setSelectedDate(date);
      setCurrentDate(new Date(date));
      fetchDiaryData();
    }
  };

  const handleDivClick = (index) => setSelectedDiv(index);

  const onChangeGetHTML = () => {
    if (editorRef.current && !diary) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data);
    }
  };

  // 이미지 압축 함수
  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 800; // 최대 너비 설정
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // 이미지 품질을 0.7로 설정해 압축
        canvas.toBlob((blob) => resolve(blob), file.type, 0.7);
      };
    };
    reader.readAsDataURL(file);
  });

  // 이미지 업로드 함수
const handleImageUpload = async (file, callback) => {
  try {
    // 이미지를 압축합니다.
    const compressedFile = await compressImage(file);

    const formData = new FormData();
    formData.append('file', compressedFile); // 압축된 파일을 FormData에 추가

    const token = localStorage.getItem('token'); // 토큰 가져오기

    const response = await axios.post('https://api.usdiary.site/diaries/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 토큰 추가
        'Content-Type': 'multipart/form-data' // multipart 형식 지정
      },
      timeout: 10000,
    });

    if (response.data && response.data.imageUrl) {
      // 서버에서 받은 이미지 URL로 에디터에 삽입
      callback(response.data.imageUrl, '이미지 설명');
    } else {
      throw new Error('이미지 URL을 받지 못했습니다.');
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("이미지 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};


  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!diary_title || !diary_content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 이미지 URL 상태에 저장된 값을 사용
    const diaryData = {
      createdAt: selectedDate,
      diary_title,
      diary_content,
      access_level,
      post_photo,  // 업로드된 이미지 URL 포함
      board_id: 1,
    };

    try {
      const response = await fetch('https://api.usdiary.site/diaries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(diaryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('저장 완료:', await response.json());
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting diary:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleUpdate = async () => {
    if (!diary) return;

    const updatedDiary = {
      diary_title,
      diary_content: editorRef.current.getInstance().getHTML(),
      access_level,
      post_photo,
    };

    try {
      const formData = new FormData();
      formData.append('diary_title', updatedDiary.diary_title);
      formData.append('diary_content', updatedDiary.diary_content);
      formData.append('access_level', updatedDiary.access_level);
      formData.append('post_photo', updatedDiary.post_photo);

      const response = await fetch(`https://api.usdiary.site/diaries/${diary.diary_id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        console.log('수정 완료:', await response.json());
        setIsEditing(false);
      } else {
        console.error('수정 실패:', response.statusText);
      }
    } catch (error) {
      console.error("Error editing diary:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://api.usdiary.site/diaries/${diary.diary_id}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        console.log('삭제 완료');
        navigate('/mypage/myRate');
      } else {
        console.error('Error deleting diary');
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };

  return (
    <div className="forest__diary">
      <div className='forestDiary_top'>
        <img src={tree} className="forest__diary-tree" alt="tree" />
        <div className="forest__diary-title">Today's Forest</div>
      </div>
      <div className="forest__diary-date">
        <DateSelector
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          theme="forest"
        />
      </div>
      <div className="forest__diary-title-edit">
        <input
          type="text"
          value={diary_title || ''}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={diaryData ? diaryData.diary_title : "제목"}
          className="forest__diary-title-edit-input"
          spellCheck={false}
          readOnly={!!diary && !isEditing}
        />
      </div>
      <div className="forest__diary-actions">
        <RevealOptions selectedDiv={access_level} onDivClick={handleDivClick} />
        {!diary ? (
          <div className="forest__diary-another-submit" onClick={() => { if (!isEditing) handleSubmit(); }}>발행</div>
        ) : (
          isEditing ? (
            <div className="forest__diary-another-submit" onClick={handleUpdate}>수정 완료</div>
          ) : (
            <DropdownMenu onEdit={handleEdit} onDelete={handleDelete} />
          )
        )}
      </div>
      <div className="forest__diary-texts">
        {isEditing || !diary ? (
          <Editor
            toolbarItems={[['heading', 'bold', 'italic', 'strike'], ['image', 'link']]}
            height="100%"
            initialEditType="wysiwyg"
            hideModeSwitch={true}
            ref={editorRef}
            onChange={onChangeGetHTML}
            hooks={{
              addImageBlobHook: (file, callback) => handleImageUpload(file, callback)
            }}
          />

        ) : (
          <Viewer initialValue={diary_content} />
        )}
      </div>
    </div>
  );
};

export default ForestComponent;
