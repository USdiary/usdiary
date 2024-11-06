import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/follow.css';

import exit from '../../../assets/images/exit.png';
import search from '../../../assets/images/search.png';

const SearchMooner = ({ onClose }) => {
    const [searchText, setSearchText] = useState('');
    const [entireUsers, setEntireUsers] = useState([]);

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    };

    // 서버에서 데이터를 받아오는 부분
    useEffect(() => {
        axios.get('/follow') // 서버의 엔드포인트로 변경
            .then((response) => {
                setEntireUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching followings:', error);
            });
    }, []);

    // 검색어에 따라 entireUsers를 필터링
    const filteredUsers = entireUsers.filter(user => 
        user.nickname.includes(searchText)
    );

    return (
        <div className="mooner_popup-overlay">
            <div className="mooner_popup-content">
                <img src={exit} className="mooner_popup_close" alt="Close popup" onClick={onClose}/>
                <div className='mooner_popup_name'>닉네임으로 무너 찾기</div>
                <div className='mooner_popup_search-id'>
                    <img src={search} alt="Search icon" />
                    <input 
                        type="text" 
                        value={searchText}
                        onChange={handleInputChange}
                        placeholder="닉네임 검색"
                        className='mooner_popup_search-id_input'
                    />
                </div>
                <div className='mooner_popup_box'>
                    {filteredUsers.map((user, index) => (
                        <div key={index} className='profile-follow_box_content_box_friend'>
                            <img src={user.image} className='profile-follow_box_content_box_friend_img' alt='profile'/>
                            <div className='profile-follow_box_content_box_friend_text'>
                                <div className='profile-follow_box_content_box_friend_text_nickname'>{user.nickname}</div>
                                <div className='profile-follow_box_content_box_friend_text_id'>{user.id}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchMooner;
