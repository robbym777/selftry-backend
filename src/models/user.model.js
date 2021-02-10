const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const User = connection.define("user", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    official: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    private: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
},
    {
        freezeTableName: true,
        tableName: "user",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = User