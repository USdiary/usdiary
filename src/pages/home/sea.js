import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import SeaPopup from "../../components/seaPopup";
import DiaryFilter from "../../components/diaryFilter";
import '../../assets/css/sea.css'; // Ensure this CSS file is correctly named and located.
import Menu from "../../components/menu";
import axios from "axios";

const Sea = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const diariesPerPage = 12;
    const pagesPerGroup = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);
    const [filter, setFilter] = useState('latest');

    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                const board_id = 3
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

    const handleDiaryClick = (diary_id, board_name) => {
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
        <div className="wrap">
            <Menu />
            <div className="sea-page__container">
                <div className="sea-page__header">
                    <h1 className="sea-page__heading">
                        Today's<br />
                        Sea
                    </h1>
                    <p className="sea-page__description">
                        오늘은 바다처럼 넓고 깊은 특별한 날을 기록하는 시간입니다. <br /> 바다가 주는 잔잔한 파도처럼, 마음을 차분히 가라앉히며 그날의 특별한 순간을 담아보세요.  <br /> 소중한 추억과 잊지 못할 경험들을 기록하며, 감정이 고스란히 남아 영원히 간직될 수 있는 시간을 만들어보세요. <br /> 바다는 인생의 특별한 날들을 아름답게 보존할 수 있는 공간이 될 것입니다.
                    </p>
                </div>
                <DiaryFilter filter={filter} onFilterChange={handleFilterChange} page="sea" />
                <div className="sea-page__diary-cards">
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

                <div className="sea-page__pagination">
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

                <div className="sea-page__tree-background"></div>

                {selectedDiaryId && (
                    <SeaPopup diary_id={selectedDiaryId} onClose={handleClosePopup} />
                )}
            </div>
        </div>
    );
}

export default Sea;