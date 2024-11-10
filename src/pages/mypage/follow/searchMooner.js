import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/follow.css';

import exit from '../../../assets/images/exit.png';
import search from '../../../assets/images/search.png';

const SearchMooner = ({ onClose }) => {
    const [searchText, setSearchText] = useState('');
    const [entireUsers, setEntireUsers] = useState([]); // 검색된 유저 저장용

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    };

    // 검색 API 호출 함수
    const fetchUsers = async () => {
        if (searchText.trim() === '') return;
        try {
            const response = await axios.get(`https://api.usdiary.site/friends/search?user_nick=${searchText}`);
            setEntireUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchUsers();
        }
    };

    const handleSearchClick = () => {
        fetchUsers();
    };

    return (
        <div className="mooner_popup-overlay">
            <div className="mooner_popup-content">
                <img src={exit} className="mooner_popup_close" alt="Close popup" onClick={onClose} />
                <div className='mooner_popup_name'>닉네임으로 무너 찾기</div>
                <div className='mooner_popup_search-id'>
                    <input 
                        type="text" 
                        value={searchText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown} 
                        placeholder="닉네임 검색"
                        className='mooner_popup_search-id_input'
                    />
                    <img 
                        src={search} 
                        alt="Search icon" 
                        onClick={handleSearchClick}
                    />
                </div>
                <div className='mooner_popup_box'>
                    {entireUsers.map((user, index) => (
                        <div key={index} className='profile-follow_box_content_box_friend'>
                            <img src={user.image} className='profile-follow_box_content_box_friend_img' alt='profile' />
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
