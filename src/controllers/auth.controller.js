const userAuthentication = async (req, res, service) => {
    const body = req.body;
    let user;
    try {
        body.password
            ? user = await service.signInManual(body)
            : user = await service.signInGoogle(body)

        if (user) {
            res.status(200);
            res.json(user);
        } else {
            res.status(401);
            res.json({ message: "Unauthorized" })
        }
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
};

const filterUser = async (req, res, service) => {
    try {
        let user = await service.checkAllUser(req.body)
        res.status(200);
        res.json(user);
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
}

const changePassword = async (req, res, service) => {
    try {
        let user = await service.changePassword(req.body)
        res.status(200);
        res.json(user);
    } catch (e) {
        res.status(500);
        res.json(e.message)
    }
}

module.exports = { userAuthentication, filterUser, changePassword };