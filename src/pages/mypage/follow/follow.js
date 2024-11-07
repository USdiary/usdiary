import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/follow.css';
import Menu from '../../../components/menu';
import SearchMooner from './searchMooner';
import RequestMooner from './requestMooner';
import ProfileMenu from '../../../components/profileMenu';
import MoonerPopup from './moonerPopup';

import search from '../../../assets/images/search.png';

const Follow = () => {
    // followers와 followings를 상태로 관리하고 초기값을 설정
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    // 검색어 상태 저장
    const [followersSearchTerm, setFollowersSearchTerm] = useState('');
    const [followingsSearchTerm, setFollowingsSearchTerm] = useState('');

    // 팝업 상태 관리
    const [showPopup, setShowPopup] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showRequestPopup, setShowRequestPopup] = useState(false);
    const [selectedFollower, setSelectedFollower] = useState(null); // 선택된 팔로워 정보


    // 서버로부터 데이터를 가져오는 함수
    const fetchFollowData = async () => {
        try {
            const followerResponse = await axios.get(`https://api.usdiary.site/friends/{sign_id}followers`); // 서버의 팔로워 데이터 엔드포인트
            const followingResponse = await axios.get(`https://api.usdiary.site/friends/{sign_id}followings`); // 서버의 팔로잉 데이터 엔드포인트

            setFollowers(followerResponse.data); // 서버에서 받은 팔로워 데이터 저장
            setFollowings(followingResponse.data); // 서버에서 받은 팔로잉 데이터 저장
        } catch (error) {
            console.error('Error fetching follow data:', error);
        }
    };

    // 컴포넌트가 마운트될 때 서버로부터 데이터 가져오기
    useEffect(() => {
        fetchFollowData();
    }, []);
    

    // 팝업 상태에 따라 스크롤 제어
    useEffect(() => {
        if (showPopup || showSearchPopup || showRequestPopup) {
            document.body.style.overflow = 'hidden'; // 팝업이 뜨면 스크롤 막기
        } else {
            document.body.style.overflow = 'auto';   // 팝업이 닫히면 스크롤 다시 허용
        }

        // cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';   // 컴포넌트가 사라질 때 스크롤 원상복구
        };
    }, [showPopup, showSearchPopup, showRequestPopup]);

    // 검색어에 맞춰 필터링
    const filteredFollowers = followers.filter(follower => 
        follower.friend_nick.includes(followersSearchTerm) || follower.friend_id.includes(followersSearchTerm)
    );

    const filteredFollowings = followings.filter(following => 
        following.friend_nick.includes(followingsSearchTerm) || following.friend_id.includes(followingsSearchTerm)
    );

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
                <div  className='profile-request' onClick={handleRequestClick}>무너 요청</div>
                <div className='profile-search' onClick={handleSearchClick}>무너 찾기</div>
                {showRequestPopup && <RequestMooner onClose={() => setShowRequestPopup(false)} />} {/* RequestMooner 팝업 */}
                {showSearchPopup && <SearchMooner onClose={() => setShowSearchPopup(false)} />} {/* SearchMooner 팝업 */}
                {showPopup && selectedFollower && <MoonerPopup follower={selectedFollower} onClose={() => setShowPopup(false)} />}
                    <div className='profile-follow'>
                        <div className='profile-follow_box'>
                            <div className='profile-follow_box_name'>나를 팔로우 하는 사람</div>
                            <div className='profile-follow_box_content'>
                                <div className='profile-follow_box_content_search'>
                                    <img src={search} alt="Search Icon" />
                                    <input 
                                        type="text" 
                                        className='profile-follow_box_content_search_name' 
                                        placeholder="검색"
                                        value={followersSearchTerm} // 검색어 상태 반영
                                        onChange={e => setFollowersSearchTerm(e.target.value)} // 입력 값 업데이트
                                    />
                                </div>
                                <div className='profile-follow_box_content_box'>
                                    {filteredFollowers.map((follower, index) => (
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
                                    <img src={search} alt="Search Icon" />
                                    <input 
                                        type="text" 
                                        className='profile-follow_box_content_search_name' 
                                        placeholder="검색"
                                        value={followingsSearchTerm} // 검색어 상태 반영
                                        onChange={e => setFollowingsSearchTerm(e.target.value)} // 입력 값 업데이트
                                    />
                                </div>
                                <div className='profile-follow_box_content_box'>
                                    {filteredFollowings.map((following, index) => (
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
