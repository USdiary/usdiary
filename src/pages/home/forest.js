import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import ForestPopup from "../../components/forestPopup";
import GuidePopup from '../../components/guide';
import DiaryFilter from "../../components/diaryFilter";
import '../../assets/css/forest.css';
import Menu from "../../components/menu";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Forest = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false); // Add a loading state
    const [error, setError] = useState(null); // Add an error state
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);
    const [filter, setFilter] = useState('latest');
    const [user_id, setUserId] = useState(null);
    const baseURL = 'https://api.usdiary.site';

    const diariesPerPage = 12;
    const pagesPerGroup = 5;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.user_id);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);

    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                const board_id = 1; // 필터링할 게시판 ID
                let response;

                // 필터에 따라 API 호출
                console.log('Current filter:', filter);
                if (filter === 'latest') {
                    response = await axios.get(`https://api.usdiary.site/diaries`, {
                        params: {
                            page: currentPage,
                            limit: diariesPerPage,
                            board_id: board_id
                        }
                    });
                } else if (filter === 'topLikes') {
                    response = await axios.get(`https://api.usdiary.site/diaries/weekly-likes`, {
                        params: {
                            page: currentPage,
                            limit: diariesPerPage,
                            board_id: board_id
                        }
                    });
                } else if (filter === 'topViews') {
                    response = await axios.get(`https://api.usdiary.site/diaries/weekly-views`, {
                        params: {
                            page: currentPage,
                            limit: diariesPerPage,
                            board_id: board_id
                        }
                    });
                }

                const total = response.data.totalDiaries; // 전체 일기 수
                const diaries = response.data.data.diary; // 일기 목록
                if (!isCancelled) {
                    setDiaries(diaries);
                    setTotalPages(Math.ceil(total / diariesPerPage)); // 총 페이지 수 계산
                    // 현재 페이지가 totalPages보다 크면 currentPage를 totalPages로 설정
                    if (currentPage > totalPages) {
                        setCurrentPage(totalPages);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (!isCancelled) setError('Failed to load data');
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };
        fetchData();
        return () => {
            isCancelled = true;
        };
    }, [currentPage, filter]);

    const indexOfLastDiary = currentPage * diariesPerPage;
    const indexOfFirstDiary = indexOfLastDiary - diariesPerPage;
    const currentDiaries = diaries.slice(indexOfFirstDiary, indexOfLastDiary);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextGroup = () => {
        if (pageGroup * pagesPerGroup + pagesPerGroup < totalPages) {
            setPageGroup(pageGroup + 1);
            setCurrentPage(pageGroup * pagesPerGroup + pagesPerGroup + 1);
        }
    };

    const handlePrevGroup = () => {
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage(pageGroup * pagesPerGroup);
        }
    };

    const pageNumbers = Array.from(
        { length: Math.min(pagesPerGroup, totalPages - pageGroup * pagesPerGroup) },
        (_, index) => pageGroup * pagesPerGroup + index + 1
    );

    const handleDiaryClick = (diary_id) => {
        setSelectedDiaryId(diary_id);
    };

    const handleClosePopup = () => {
        setSelectedDiaryId(null);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
        setPageGroup(0);
    };

    return (
        <div className="page">
            <GuidePopup />
            <div className="wrap">
                <Menu />
                <div className="forest-page__container">
                    <div className="forest-page__header">
                        <h1 className="forest-page__heading">
                            Today's<br />
                            Forest
                        </h1>
                        <p className="forest-page__description">
                            오늘은 숲속에서 느림의 미학을 만끽해보세요. <br /> 작은 것에서부터 큰 깨달음을 찾고, 하루 속에서 숨어 있는 의미를 발견할 수 있는 시간이 될 거예요. <br /> 자연의 소리를 들으며 마음의 여유를 되찾고, 하루를 차분히 기록해보세요. <br /> 여유로운 순간들이 모여, 나만의 이야기를 숲속에 채워넣을 수 있을 것입니다.
                        </p>
                    </div>
                    <DiaryFilter filter={filter} onFilterChange={handleFilterChange} page="forest" />
                    <div className="forest-page__diary-cards">
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {!loading && !error && currentDiaries.map((diary) => (
                            <DiaryCard
                                key={diary.diary_id}
                                diary_title={diary.diary_title}  // title → diary_title
                                createdAt={diary.createdAt}       // date → createdAt
                                diary_content={diary.diary_content.substring(0, 20) + ' ...'}  // summary → diary_content
                                post_photo={`${baseURL}${diary.post_photo}`}    // imageUrl → post_photo
                                board_name={diary.Board.board_name}     // boardName → board_name
                                user_nick={diary.User.user_nick}        // nickname → user_nick
                                like_count={diary.like_count}
                                diary_id={diary.diary_id}
                                onClick={() => handleDiaryClick(diary.diary_id)}
                                user_id={user_id}
                            />
                        ))}
                    </div>

                    <div className="forest-page__pagination">
                        <button
                            onClick={handlePrevGroup}
                            disabled={pageGroup === 0}
                            className="pagination-arrow"
                        >
                            &lt;
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={number === currentPage ? 'active' : ''}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            onClick={handleNextGroup}
                            disabled={pageGroup * pagesPerGroup + pagesPerGroup >= totalPages}
                            className="pagination-arrow"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="forest-page__tree-background"></div>

                    {selectedDiaryId && (
                        <ForestPopup diary_id={selectedDiaryId} onClose={handleClosePopup} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Forest;
