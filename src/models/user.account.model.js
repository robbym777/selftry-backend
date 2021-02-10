const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const UserAccount = connection.define("userAccount", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
},
    {
        freezeTableName: true,
        tableName: "userAccount",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = UserAccount