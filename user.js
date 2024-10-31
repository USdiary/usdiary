const {Sequelize} = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user_name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        user_pwd: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        user_gender: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        user_birthday: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        user_email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        ban_count: {
          type: Sequelize.Sequelize.BIGINT,
          allowNull: false,
          defaultValue:0
        },
        user_tendency: {
          type: Sequelize.ENUM('숲','도시'),
          allowNull: false,
        },
        user_nick: {
          type: Sequelize.STRING(255),
          allowNull: true,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
    
    static associate(models) {
      //(1:N)
      this.hasMany(models.Comment, { foreignKey: "user_id", sourceKey: "user_id" });
      this.hasMany(models.Friend, { foreignKey: "user_id", sourceKey: "user_id" });
      this.hasMany(models.Like, { foreignKey: "diary_user", sourceKey: "user_id" });
      this.hasMany(models.Notification, { foreignKey: "user_id", sourceKey: "user_id" });
      this.hasMany(models.Qna, { foreignKey: "user_id", sourceKey: "user_id" });
      this.hasMany(models.Answer, { foreignKey: "user_id", sourceKey: "user_id" });
    }
  }

module.exports = User;