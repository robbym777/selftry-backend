const User = require("./user.model");
const UserAccount = require("./user.account.model");
const UserProfile = require("./user.profile.model");
const Fan = require("./fan.model");
const Friend = require("./friend.model");
const Content = require("./content.model");
const Comment = require("./comment.model");
const Like = require("./like.model");

const dbAssociation = function dbAssociation() {
    Comment.belongsTo(Content)
    Like.belongsTo(Content)
    Content.hasMany(Comment)
    Content.hasMany(Like)

    Fan.belongsTo(User)
    Friend.belongsTo(User)
    Content.belongsTo(User)

    User.hasOne(UserAccount)
    User.hasOne(UserProfile)
    User.hasMany(Fan)
    User.hasMany(Friend)
    User.hasMany(Content)
}
module.exports = dbAssociation;