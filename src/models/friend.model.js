const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const Friend = connection.define("friend", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    person: {
        type: Sequelize.STRING,
        allowNull: false,
    }
},
    {
        freezeTableName: true,
        tableName: "friend",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = Friend