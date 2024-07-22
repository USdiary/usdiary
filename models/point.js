const {Sequelize} = require("sequelize");

class Point extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        point_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true

        },
        point_num: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0
        },
        point_con: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
         

        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Point",
        tableName: "points",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  

  // User와 Point 간의 1:n 관계 설정
    static associate(db) { // DB 관계설정
      db.Point.belongsTo(db.User, {
        foreignKey: "user_id",
        sourceKey: "user_id",
        onDelete: "CASCADE",
      });
    }
    
}

module.exports = Point;