const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const Fan = connection.define("fan", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    person: {
        type: Sequelize.STRING,
        allowNull: false,
    },
},
    {
        freezeTableName: true,
        tableName: "fan",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = Fan