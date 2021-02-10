const express = require('express');
const router = express.Router();

const { getContentMethod } = require('../controllers/content.controller');
const ContentService = require('../services/content.service');
const Content = require('../models/content.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const tokenValidation = require('../middlewares/token.validation');

const contentService = new ContentService(Content, Comment, Like);

router.use(tokenValidation);
router.get('/app/readContent', (req, res, next) => getContentMethod(req, res, contentService));

module.exports = router