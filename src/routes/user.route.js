const express = require('express');
const router = express.Router();

const { getUserMethod, postUserMethod, putUserMethod, deleteUserMethod } = require('../controllers/user.controller');
const UserService = require('../services/user.service');
const User = require("../models/user.model");
const UserAccount = require("../models/user.account.model");
const UserProfile = require("../models/user.profile.model");
const Fan = require("../models/fan.model");
const Friend = require("../models/friend.model");
const Content = require("../models/content.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model");
const tokenValidation = require('../middlewares/token.validation');

const userService = new UserService(User, UserAccount, UserProfile, Fan, Friend, Content, Comment, Like);

router.post('/app/createUser', (req, res, next) => postUserMethod(req, res, userService));
router.use(tokenValidation)
router.get('/app/readUser', (req, res, next) => getUserMethod(req, res, userService));
router.put('/app/updateUser', (req, res, next) => putUserMethod(req, res, userService));
router.delete('/app/deleteUser', (req, res, next) => deleteUserMethod(req, res, userService));

module.exports = router;
