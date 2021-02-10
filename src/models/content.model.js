const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const Content = connection.define("content", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
    },
    caption: {
        type: Sequelize.STRING,
    },
    picture: {
        type: Sequelize.STRING,
    },
},
    {
        freezeTableName: true,
        tableName: "content",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = Content