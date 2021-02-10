const express = require('express');
const router = express.Router();

const { postCommentMethod } = require('../controllers/comment.controller')
const CommentService = require('../services/comment.service');
const Content = require('../models/content.model');
const Comment = require('../models/comment.model');
const tokenValidation = require('../middlewares/token.validation');

const commentService = new CommentService(Content, Comment)

router.use(tokenValidation)
router.post('/app/createComment', (req, res, next) => postCommentMethod(req, res, commentService))

module.exports = router