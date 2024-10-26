import React, { useState } from 'react';
import '../../assets/css/follow.css';
import '../../assets/css/contact.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';
import axios from 'axios';

const Contact = () => {
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [inquiry, setInquiry] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지

        const requestBody = {
            sender: {
                email: email,
            },
            subject: title,
            message: inquiry,
        };

        try {
            const response = await axios.post('/api/questions', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 성공적으로 요청을 보낸 후의 처리
            console.log('Success:', response.data);
            alert('문의가 성공적으로 전송되었습니다.');

            // 입력 필드 초기화
            setTitle('');
            setEmail('');
            setInquiry('');
        } catch (error) {
            if (error.response) {
                // 요청이 이루어졌고, 서버가 상태 코드로 응답했으나 요청이 실패한 경우
                console.error('Error:', error.response.data);
                alert('문의 전송에 실패했습니다: ' + error.response.data.error);
            } else {
                // 요청이 이루어지지 않았거나 다른 이유로 실패한 경우
                console.error('Error:', error.message);
                alert('문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className='wrap'>
            <Menu />
            <div className='contact'>
                <ProfileMenu />
                <div className='contact-contents'>
                    <h1 className='contact-title'>고객 지원</h1>
                    <form className='contact-form' onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='title'></label>
                            <input
                                type='text'
                                id='title'
                                placeholder='제목'
                                className='input-field'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'></label>
                            <input
                                type='email'
                                id='email'
                                placeholder='답변 받으실 이메일을 입력해주세요 (필수입력)'
                                className='input-field'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='inquiry'></label>
                            <textarea
                                id='inquiry'
                                placeholder='문의 사항을 자유롭게 남겨주세요...'
                                className='textarea-field'
                                value={inquiry}
                                onChange={(e) => setInquiry(e.target.value)}
                            />
                        </div>
                        <button type='submit' className='submit-button'>제출</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
