'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require("./user");
const Comment = require("./comment");
const Friend = require('./friend');
const Like = require('./like');
const Notification = require("./notification");
const Diary = require("./diary");
const QnA = require("./qna"); //Q&A로 작성하면 오류가 나서 QNA로 작성
const Answer = require("./answer");
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = User;
db.Comment = Comment;
db.Friend = Friend;
db.Like = Like;
db.Notification = Notification;
db.Diary = Diary;
db.QnA = QnA;
db.Answer = Answer;

User.initiate(sequelize);
Comment.initiate(sequelize);
Friend.initiate(sequelize);
Like.initiate(sequelize);
Notification.initiate(sequelize);
Diary.initiate(sequelize);
QnA.initiate(sequelize);
Answer.initiate(sequelize);

User.associate(db);
Comment.associate(db);
Friend.associate(db);
Like.associate(db);
Notification.associate(db);
Diary.associate(db);
QnA.associate(db);
Answer.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
