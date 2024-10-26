import React, { useEffect, useState } from "react";
import DiaryCard from '../../components/diaryCard';
import '../../assets/css/friend.css';
import Menu from '../../components/menu';
import axios from "axios";

const Friend = () => {
    const [diaries, setDiaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const diariesPerPage = 12;
    const pagesPerGroup = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/friend'); // Replace with your API URL
                const data = response.data;
                setDiaries(data);
                setTotalPages(Math.ceil(data.length / diariesPerPage));
            } catch (error) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    return (
        <div className="wrap">
            <Menu />
            <div className="friend-page__container">
                <div className="friend-page__header">
                    <h1 className="friend-page__heading">
                        Today's<br />
                        Friend
                    </h1>
                    <p className="friend-page__description">
                        무너와 함께 나누는 특별한 하루입니다. <br /> 소중한 무너가 어떤 하루를 보냈는지, 그들의 생각과 감정을 함께 느껴보세요. <br /> 서로의 기록을 공유하며, 새로운 발견과 교감을 나누는 시간이 될 것입니다. <br /> 무너의 이야기를 통해 더 깊이 연결되고, 그들의 하루를 이해하는 특별한 경험을 해보세요.
                    </p>
                </div>
                <div className="friend-page__filter-box">
                    <div className="friend-page__filter-option">Latest</div>
                    <div className="friend-page__filter-option">Top Views</div>
                    <div className="friend-page__filter-option">Top Likes</div>
                </div>
                <div className="friend-page__diary-cards">
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && currentDiaries.map((diary) => (
                        <DiaryCard
                            key={diary.diary_id}
                            title={diary.diary_title}
                            date={diary.date}
                            summary={diary.diary_content.substring(0, 20) + ' ...'}
                            imageUrl={diary.post_photo}
                            boardName={diary.board_name}
                            nickname={diary.nickname}
                            isFriendPage={true}
                            diaryId={diary.diary_id}
                        />
                    ))}
                </div>

                <div className="friend-page__pagination">
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

                <div className="friend-page__tree-background"></div>
            </div>
        </div>
    );
}

export default Friend;
