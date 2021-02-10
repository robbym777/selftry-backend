const express = require('express');
const router = express.Router();

const { userAuthentication, filterUser, changePassword } = require('../controllers/auth.controller');
const AuthService = require('../services/auth.service');
const User = require("../models/user.model");
const UserAccount = require("../models/user.account.model");
const UserProfile = require("../models/user.profile.model");
const Fan = require("../models/fan.model");
const Friend = require("../models/friend.model");
const Content = require("../models/content.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model");

const authService = new AuthService(User, UserAccount, UserProfile, Fan, Friend, Content, Comment, Like);

router.post('/app/login', (req, res, next) => userAuthentication(req, res, authService));
router.post('/app/filter', (req, res, next) => filterUser(req, res, authService));
router.post('/app/forgotPassword', (req, res, next) => changePassword(req, res, authService))

module.exports = router;
