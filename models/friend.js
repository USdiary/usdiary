const {Sequelize} = require("sequelize");

class Friend extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        friend_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user_id2: {
          type: Sequelize.BIGINT,  //구독한 사람 타입이 정의되어 있지 않아서 유저 아이디와 동일하게 타입 설정
          allowNull: false,
          primaryKey: true,
        },
        relationship: {
          type: Sequelize.BOOLEAN, //Domain은 BOOLEAN이고 type는 BOOL이라서 BOOL로 작성
          allowNull: true,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Friend",
        tableName: "Friend",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", targetKey: "user_id" }); //(N:1)여러 명의 친구가 한명의 사용자에게 팔로잉될 수 있음
  }
    }

module.exports = Friend;