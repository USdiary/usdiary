const {Sequelize} = require("sequelize");

class Todo extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        todo_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Todo",
        tableName: "todos",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.Todo.belongsTo(db.Checklist, {
      foreignKey: "checklist_id",
      targetKey: "checklist_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Todo;