const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const Like = connection.define("like", {
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
},
    {
        freezeTableName: true,
        tableName: "like",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = Like