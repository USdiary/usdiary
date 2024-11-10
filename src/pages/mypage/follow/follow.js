import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/follow.css';
import Menu from '../../../components/menu';
import SearchMooner from './searchMooner';
import RequestMooner from './requestMooner';
import ProfileMenu from '../../../components/profileMenu';
import MoonerPopup from './moonerPopup';
import { jwtDecode } from 'jwt-decode';
import search from '../../../assets/images/search.png';

const Follow = () => {
    // followers와 followings를 상태로 관리하고 초기값을 설정
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [sign_id, setSignId] = useState(null);

    // 검색어 상태 저장
    const [followersSearchTerm, setFollowersSearchTerm] = useState('');
    const [followingsSearchTerm, setFollowingsSearchTerm] = useState('');

    // 팝업 상태 관리
    const [showPopup, setShowPopup] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showRequestPopup, setShowRequestPopup] = useState(false);
    const [selectedFollower, setSelectedFollower] = useState(null); // 선택된 팔로워 정보


    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const savedSignId = decoded.sign_id;
                if (savedSignId) {
                    setSignId(savedSignId);
                }
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleSearchFollowers = async () => {
        if (!sign_id) return;
        try {
            const response = await axios.get(`https://api.usdiary.site/friends/${sign_id}/followers`, {
                params: { friend_nick: followersSearchTerm },
            });
            setFollowers(response.data);
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    };

    const handleSearchFollowings = async () => {
        if (!sign_id) return;
        try {
            const response = await axios.get(`https://api.usdiary.site/friends/${sign_id}/followings`, {
                params: { friend_nick: followingsSearchTerm },
            });
            setFollowings(response.data);
        } catch (error) {
            console.error('Error fetching followings:', error);
        }
    };

    // 엔터 키 감지 및 검색 실행
    const handleKeyDown = (e, isFollower) => {
        if (e.key === 'Enter') {
            isFollower ? handleSearchFollowers() : handleSearchFollowings();
        }
    };

    // 팔로워 클릭 시 팝업 열기
    const handleFollowerClick = (follower) => {
        setSelectedFollower(follower); // 선택된 팔로워 저장
        setShowPopup(true);
    };

    // 무너 찾기 버튼 클릭 시 SearchMooner 팝업 열기
    const handleSearchClick = () => {
        setShowSearchPopup(true);
    };

    // 무너 요청 클릭 시 RequestMooner 팝업 열기
    const handleRequestClick = () => {
        setShowRequestPopup(true);
    };

    return (
        <div className='wrap'>
            <Menu/>
            
            <div className='profile'>
                <ProfileMenu />
                <div className='profile-contents'>
                    <div className='profile-request' onClick={handleRequestClick}>무너 요청</div>
                    <div className='profile-search' onClick={handleSearchClick}>무너 찾기</div>
                    {showRequestPopup && <RequestMooner onClose={() => setShowRequestPopup(false)} />}
                    {showSearchPopup && <SearchMooner onClose={() => setShowSearchPopup(false)} />}
                    {showPopup && selectedFollower && <MoonerPopup follower={selectedFollower} onClose={() => setShowPopup(false)} />}

                    <div className='profile-follow'>
                        <div className='profile-follow_box'>
                            <div className='profile-follow_box_name'>나를 팔로우 하는 사람</div>
                            <div className='profile-follow_box_content'>
                                <div className='profile-follow_box_content_search'>
                                    <input 
                                        type="text" 
                                        className='profile-follow_box_content_search_name' 
                                        placeholder="검색"
                                        value={followersSearchTerm}
                                        onChange={e => setFollowersSearchTerm(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, true)}
                                    />
                                    <img src={search} alt="Search Icon" onClick={handleSearchFollowers} />
                                </div>
                                <div className='profile-follow_box_content_box'>
                                    {followers.map((follower, index) => (
                                        <div key={index} className='profile-follow_box_content_box_friend' onClick={() => handleFollowerClick(follower)}>
                                            <img src={follower.friend_profile_img} className='profile-follow_box_content_box_friend_img' alt={follower.friend_nick} />
                                            <div className='profile-follow_box_content_box_friend_text'>
                                                <div className='profile-follow_box_content_box_friend_text_nickname'>{follower.friend_nick}</div>
                                                <div className='profile-follow_box_content_box_friend_text_id'>{follower.friend_id}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='profile-follow_box'>
                            <div className='profile-follow_box_name'>내가 팔로우 하는 사람</div>
                            <div className='profile-follow_box_content'>
                                <div className='profile-follow_box_content_search'>
                                    <input 
                                        type="text" 
                                        className='profile-follow_box_content_search_name' 
                                        placeholder="검색"
                                        value={followingsSearchTerm}
                                        onChange={e => setFollowingsSearchTerm(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, true)}
                                    />
                                    <img src={search} alt="Search Icon" onClick={handleSearchFollowings} />
                                </div>
                                <div className='profile-follow_box_content_box'>
                                    {followings.map((following, index) => (
                                        <div key={index} className='profile-follow_box_content_box_friend' onClick={() => handleFollowerClick(following)}>
                                            <img src={following.friend_profile_img} className='profile-follow_box_content_box_friend_img' alt={following.friend_nick} />
                                            <div className='profile-follow_box_content_box_friend_text'>
                                                <div className='profile-follow_box_content_box_friend_text_nickname'>{following.friend_nick}</div>
                                                <div className='profile-follow_box_content_box_friend_text_id'>{following.friend_id}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Follow;
