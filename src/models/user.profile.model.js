const Sequelize = require("sequelize");
const connection = require("../../config/dbConn");

const UserProfile = connection.define("userProfile", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    photo: {
        type: Sequelize.STRING,
    },
    background: {
        type: Sequelize.STRING,
        defaultValue: "https://firebasestorage.googleapis.com/v0/b/selftry-mobile.appspot.com/o/user%2Fbackground%2Fdefault.jpg?alt=media&token=c17b5e9f-86db-41a7-939b-44f43b282eec"
    },
    name: {
        type: Sequelize.STRING,
    },
    note: {
        type: Sequelize.STRING,
    },
    gender: {
        type: Sequelize.ENUM("Male", "Female"),
        allowNull: false,
    },
    birth: {
        type: Sequelize.STRING,
        allowNull: false,
    },
},
    {
        freezeTableName: true,
        tableName: "userProfile",
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);
module.exports = UserProfile