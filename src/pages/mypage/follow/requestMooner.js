import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/css/follow.css';

import exit from '../../../assets/images/exit.png';

const RequestMooner = ({ onClose }) => {
    const [entireUsers, setEntireUsers] = useState([]);

    useEffect(() => {
        axios.get('https://api.usdiary.site/friends/follow-request/handle')
            .then((response) => {
                setEntireUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching follow requests:', error);
            });
    }, []);
    
    const handleAccept = (user) => {
        axios.post('https://api.usdiary.site/friends/follow-request/handle', {
            follower_sign_id: user.id,
            action: 'accepted',
        })
        .then((response) => {
            setEntireUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        })
        .catch((error) => {
            console.error('Error accepting follow request:', error);
        });
    };
    
    const handleRefuse = (user) => {
        axios.post('https://api.usdiary.site/friends/follow-request/handle', {
            follower_sign_id: user.id,
            action: 'refused',
        })
        .then((response) => {
            setEntireUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        })
        .catch((error) => {
            console.error('Error refusing follow request:', error);
        });
    };
    
    return (
        <div className="mooner_popup-overlay">
            <div className="mooner_popup-content">
                <img src={exit} className="mooner_popup_close" alt="Close popup" onClick={onClose} />
                <div className='mooner_popup_name'>무너 요청</div>
                <div className='request_box'>
                    {entireUsers.map((user, index) => (
                        <div key={index} className='profile-follow_box_content_box_friend'>
                            <img src={user.image} className='profile-follow_box_content_box_friend_img' alt='profile' />
                            <div className='profile-follow_box_content_box_friend_text'>
                                <div className='profile-follow_box_content_box_friend_text_nickname'>{user.nickname}</div>
                                <div className='profile-follow_box_content_box_friend_text_id'>{user.id}</div>
                            </div>
                            <div className='request_accept' onClick={() => handleAccept(user)}>수락</div>
                            <div className='request_refusal' onClick={() => handleRefuse(user)}>거절</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RequestMooner;
