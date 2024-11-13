import React, { useState } from 'react';
import '../../../assets/css/follow.css';
import exit from '../../../assets/images/exit.png';
import moonerphoto1 from '../../../assets/images/moonerphoto1.jpg';
import moonerphoto2 from '../../../assets/images/moonerphoto2.jpg';
import moonerphoto3 from '../../../assets/images/moonerphoto3.jpg';

const RequestMooner = ({ onClose }) => {
    const [entireUsers, setEntireUsers] = useState([
        {
            id: Sohee1122,
            nickname: "또리",
            image: moonerphoto1,
        },
        {
            id: WonBin22,
            nickname: "비니",
            image: moonerphoto2,
        },
        {
            id: Freshboyy,
            nickname: "우낙",
            image: moonerphoto3,
        },
    ]);

    /*
    useEffect(() => {
        axios.get('https://api.usdiary.site/friends/follow-request/handle')
            .then((response) => {
                setEntireUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching follow requests:', error);
            });
    }, []);
    */

    const handleAccept = (user) => {
        setEntireUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        console.log(`${user.nickname} 님의 요청을 수락했습니다.`);
    };

    const handleRefuse = (user) => {
        setEntireUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        console.log(`${user.nickname} 님의 요청을 거절했습니다.`);
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
