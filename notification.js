const {Sequelize} = require("sequelize");

class Notification extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        noti_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        is_read: {
          type: Sequelize.BOOL, //Domain은 BOOLEAN이고 type는 BOOL이라서 BOOL로 작성
          allowNull: true,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'User', 
            key: 'user_id', 
          },
        },
        friend_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Firend', 
            key: 'friend_id', 
          },
        },
        comment_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Comment', 
            key: 'comment_id', 
          },
        },
        like_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Like', 
            key: 'like_id', 
          },
        },
        qna_id3: {   //원래 아이디가 q&a id3인데 '&'가 오류를 일으켜서 n으로 대체하고 띄어쓰기 대신 언더바로 대체
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'QnA', 
            key: 'qna_id', //근데 질문번호라면 Q&A테이블에 있는데 qna_id3는 likes에 연결되어있다고 나와서 뭔지 모르겠네요...흠...
          },
        },
        ans_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Answer', 
            key: 'ans_id', 
          },
        },        
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Notification",
        tableName: "notification",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(models) {
    //(N:1) 각 테이블에서 변동사항이 있을때마다 여러 알림이 갈 수 있음 
    this.belongsTo(models.User, { foreignKey: "user_id", targetKey: "user_id" }); 
    this.belongsTo(models.Friend, { foreignKey: "friend_id", targetKey: "friend_id" }); 
    this.belongsTo(models.Comment, { foreignKey: "comment_id", targetKey: "comment_id" });  
    this.belongsTo(models.Friend, { foreignKey: "user_id2", targetKey: "user_id2" });
    this.belongsTo(models.Like, { foreignKey: "like_id", targetKey: "like_id" });
    this.belongsTo(models.Qna, { foreignKey: "qna_id3", targetKey: "qna_id" }); 
    this.belongsTo(models.Answer, { foreignKey: "ans_id", targetKey: "ans_id" }); 
  }
    }

module.exports = Notification;