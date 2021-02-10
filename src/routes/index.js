const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const commentRoute = require('./comment.route');
const contentRoute = require('./content.route');
const logRoute = require('./log.route');
const noRoute = require('./no.route');

router.use(logRoute);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/comment', commentRoute);
router.use('/content', contentRoute);
router.use(noRoute);

module.exports = router;
