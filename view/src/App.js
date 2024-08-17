import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login.js';
import ForestDiary from './diaries/diaries_forest.js';
import CityDiary from './diaries/diaries_city.js';
import SeaDiary from './diaries/diaries_sea.js';

const App = () => {

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 경로 */}
        <Route path="/" element={<Login />}></Route>
        {/* 숲 다이어리 페이지 경로 */}
        <Route path="/forest_diary" element={<ForestDiary />}></Route>
        {/* 도시 다이어리 페이지 경로 */}
        <Route path="/city_diary" element={<CityDiary />}></Route>
        {/* 바다 다이어리 페이지 경로 */}
        <Route path="/sea_diary" element={<SeaDiary />}></Route>        
      </Routes>
    </Router>
  )
}

export default App;
