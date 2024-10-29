import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Forest from "./forest";
import City from "./city";

const Home = () => {
    const location = useLocation();
    const userTendency = location.state?.userTendency; // location.state에서 userTendency 가져오기

    useEffect(() => {
        if (userTendency) {
            localStorage.setItem('selectedMenu', userTendency === '숲' ? 'forest' : userTendency === '도시' ? 'city' : 'sea');
        }
    }, [userTendency]);

    useEffect(() => {
        if (userTendency) {
            localStorage.setItem('userTendency', userTendency);
        }
    }, [userTendency]);

    if (userTendency === '숲') {
        return <Forest />;
    } else if (userTendency === '도시') {
        return <City />;
    } else {
        return (
            <div>
                <h1>알 수 없는 경향성</h1>
                <p>해당 경향성에 맞는 페이지를 찾을 수 없습니다.</p>
            </div>
        );
    }
}

export default Home;
