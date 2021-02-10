const postCommentMethod = async (req, res, service) => {
    const id = req.query.id
    const body = req.body
    try {
        let comment = await service.postComment(body, id)
        res.status(200);
        res.json(comment);
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}

module.exports = { postCommentMethod }