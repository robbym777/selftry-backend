const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const Comment = connection.define("comment", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    person: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
},
    {
        freezeTableName: true,
        tableName: "comment",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = Comment