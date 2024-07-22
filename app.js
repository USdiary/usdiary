const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const {sequelize} = require('./models'); // db.sequelize 객체

app.set('port', process.env.PORT||3001);

sequelize.sync({force : false}) // 서버 실행시 MySQL 과 연동되도록 하는 sync 메서드 
// force : true 로 해놓으면 서버 재시작마다 테이블이 재생성됨. 테이블을 잘못 만든 경우에 true 로 설정
.then(() => {
    console.log('데이터 베이스 연결 성공');
})
.catch((err) => {
    console.log(err);
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "index.html")));
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use((req, res, next) =>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err,req ,res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})