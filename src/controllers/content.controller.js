const getContentMethod = async (req, res, service) => {
    const id = req.query.id
    let content
    try {
        content = await service.getByID(id)
        if (content) {
            res.status(200);
            res.json(content);
        }
    } catch (e) {
        res.status(500);
        res.json(e.message);
    }
}
module.exports = { getContentMethod }