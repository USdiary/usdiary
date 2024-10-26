import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import CityPopup from "../../components/cityPopup";
import GuidePopup from '../../components/guide';
import DiaryFilter from "../../components/diaryFilter";
import '../../assets/css/city.css';
import Menu from "../../components/menu";
import axios from "axios";

const City = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const diariesPerPage = 12;
    const pagesPerGroup = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);
    const [filter, setFilter] = useState('latest');

    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                const board_id = 2
                let response;

                if (filter === 'latest') {
                    response = await axios.get('/diaries', {
                        params: {
                            page: currentPage,
                            limit: diariesPerPage,
                            board_id: board_id
                        }
                    });
                } else if (filter === 'topLikes') {
                    response = await axios.get('/diaries/weekly-likes', {  // 수정된 부분
                        params: {
                            page: currentPage,
                            limit: diariesPerPage,
                            board_id: board_id
                        }
                    });
                } else if (filter === 'topViews') {  // Top Views 필터에 대한 API 호출 추가
                    response = await axios.get('/diaries/weekly-views', {
                        params: {
                            page: currentPage,
                            limit: diariesPerPage,
                            board_id: board_id
                        }
                    });
                }

                const total = response.data.totalDiaries;
                const diaries = response.data.data.diary;
                if (!isCancelled) {
                    setDiaries(diaries);
                    setTotalPages(Math.ceil(total / diariesPerPage));
                }
            } catch (error) {
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


    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

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
        setSelectedDiaryId(diary_id); // 클릭한 다이어리 ID를 설정
    };

    const handleClosePopup = () => {
        setSelectedDiaryId(null); // 팝업 닫기
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter); // 선택한 필터로 상태 업데이트
        setCurrentPage(1); // 페이지를 1로 초기화
        setPageGroup(0); // 페이지 그룹 초기화
    };

    return (
        <div className="page">
            <GuidePopup />
            <div className="wrap">
                <Menu />
                <div className="city-page__container">
                    <div className="city-page__header">
                        <h1 className="city-page__heading">
                            Today's<br />
                            City
                        </h1>
                        <p className="city-page__description">
                            오늘은 분주한 도시 속에서 체계적으로 하루를 계획해보세요. <br /> 바쁜 일정 속에서도 나만의 시간을 찾아 효율적으로 일정을 관리하고, 그 성취감을 기록하세요. <br /> 목표를 이루기 위한 작은 단계들까지 꼼꼼히 기록하며, 스스로의 성장을 확인할 수 있는 기회가 될 것입니다. <br /> 바쁜 하루 속에서도 기록을 통해 내면의 성취를 발견해보세요.

                        </p>
                    </div>
                    <DiaryFilter filter={filter} onFilterChange={handleFilterChange} page="city" />
                    <div className="city-page__diary-cards">
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {!loading && !error && currentDiaries.map((diary) => (
                            <DiaryCard
                                key={diary.diary_id}
                                title={diary.diary_title}
                                date={diary.createdAt}
                                summary={diary.diary_content.substring(0, 20) + ' ...'}
                                imageUrl={diary.post_photo}
                                boardName={diary.Board.board_name}
                                nickname={diary.User.user_nick}
                                diaryId={diary.diary_id}
                                onClick={() => handleDiaryClick(diary.diary_id)}
                            />
                        ))}
                    </div>

                    <div className="city-page__pagination">
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

                    <div className="city-page__tree-background"></div>

                    {selectedDiaryId && (
                        <CityPopup diary_id={selectedDiaryId} onClose={handleClosePopup} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default City;
