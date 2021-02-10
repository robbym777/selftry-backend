const getUserMethod = async (req, res, service) => {
    const userName = req.query.userName;
    const id = req.query.id
    let user;
    try {

        userName
            ? user = await service.getByUsername(userName)
            : id
                ? user = await service.getByID(id)
                : user = await service.getAllUsers()

        if (user) {
            res.status(200);
            res.json(user);
        } else {
            res.status(404);
            res.json({ message: "User Not Found" });
        }
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
};

const postUserMethod = async (req, res, service) => {
    try {
        let user = await service.postUser(req.body)
        res.status(200);
        res.json(user);
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
}

const putUserMethod = async (req, res, service) => {
    const id = req.query.id;
    try {
        let user = await service.putUser(id, req.body)
        res.status(200);
        res.json(user);
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
}

const deleteUserMethod = async (req, res, service) => {
    const id = req.query.id
    try {
        let user = await service.deleteUser(id)
        res.status(200);
        res.json(user);
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
}

module.exports = { getUserMethod, postUserMethod, putUserMethod, deleteUserMethod };