const logEvent = require('../events/myEmitter');
const sequelize = require('../../config/dbConn');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

class UserService {
    constructor(user, userAccount, userProfile, fan, friend, content, comment, like) {
        this.user = user
        this.userAccount = userAccount
        this.userProfile = userProfile
        this.fan = fan
        this.friend = friend
        this.content = content
        this.comment = comment
        this.like = like
    }
    userInclude = (args) => {
        let account
        if (args) {
            account = {
                model: this.userAccount,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                where: { userName: args },
            }
        } else {
            account = {
                model: this.userAccount,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] }
            }
        }
        return [
            account,
            {
                model: this.userProfile,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
            {
                model: this.fan,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
            {
                model: this.friend,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
            {
                model: this.content,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.comment,
                        order: [['createdAt', 'DESC']],
                        attributes: { exclude: ['updatedAt', 'deletedAt'] },
                    },
                    {
                        model: this.like,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                ]
            }
        ]
    }

    async getAllUsers() {
        let result
        try {
            result = await this.user.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: this.userInclude()
            })
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-GET-ALL-USERS-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }

    async getByID(id) {
        let result
        try {
            result = await this.user.findByPk(id, {
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: this.userInclude()
            })
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-GET-BY-ID-USER-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }

    async getByUsername(userName) {
        let result
        try {
            result = await this.user.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: this.userInclude({ [Op.substring]: `${userName}` })
            })
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-GET-BY-USERNAME-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }


    async postUser(data) {
        let result
        const trx = await sequelize.transaction()
        try {
            let user = await this.user.create({}, { transaction: trx })
            let account = await this.userAccount.create({
                userName: data.userAccount.userName,
                email: data.userAccount.email,
                phoneNumber: data.userAccount.phoneNumber,
                password: bycrypt.hashSync(data.userAccount.password, 8)
            }, { transaction: trx })
            let profile = await this.userProfile.create(data.userProfile, { transaction: trx })

            user.setUserAccount(account)
            user.setUserProfile(profile)

            trx.commit()
            const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
            result = {
                token: accessToken
            }
        } catch (e) {
            await trx.rollback()
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-POST-USER-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }

    async putUser(id, data) {
        let result
        const user = await this.user.findByPk(id, { include: this.userInclude() })
        if (user) {
            const trx = await sequelize.transaction();
            try {
                if (data.userAccount) {
                    await this.userAccount.update({
                        userName: data.userAccount.userName,
                        password: bycrypt.hashSync(data.userAccount.password, 8),
                        email: data.userAccount.email,
                        phoneNumber: data.userAccount.phoneNumber
                    }, { where: { id: user.userAccount.id }, transaction: trx })
                }
                if (data.userProfile) {
                    await this.userProfile.update(data.userProfile, { where: { id: user.userProfile.id }, transaction: trx })
                }
                let notify = { id: id }
                await this.user.update(notify, { where: { id: id }, transaction: trx })
                await trx.commit();
                result = user
            } catch (e) {
                await trx.rollback();
                logEvent.emit('APP-ERROR', {
                    logTitle: '(SERVICE)-PUT-USER-FAILED',
                    logMessage: console.log(e)
                })
                throw new Error(e)
            }
        } else {
            result = { message: "No User Found" }
        }
        return result
    }

    async deleteUser(id) {
        let result;
        const user = await this.employee.findByPk(id, { include: this.userInclude() });
        if (user) {
            const trx = await sequelize.transaction();
            try {
                for (let i of user.content) {
                    await this.like.destroy({ where: { contentId: i.id }, transaction: trx });
                    await this.comment.destroy({ where: { contentId: i.id }, transaction: trx });
                }
                await this.content.destroy({ where: { userId: user.id }, transaction: trx });
                await this.friend.destroy({ where: { userId: user.id }, transaction: trx });
                await this.fan.destroy({ where: { userId: user.id }, transaction: trx });
                await this.userProfile.destroy({ where: { userId: user.id }, transaction: trx });
                await this.userAccount.destroy({ where: { userId: user.id }, transaction: trx });
                await this.user.destroy({ where: { id: id }, transaction: trx });
                await trx.commit();
                result = { message: "User Has Been Removed" }
            } catch (e) {
                trx.rollback();
                logEvent.emit('APP-ERROR', {
                    logTitle: '(SERVICE)-DELETE-USER-FAILED',
                    logMessage: console.log(e)
                });
                throw new Error(e);
            }
        } else {
            result = { message: "No User Found" }
        }
        return result;
    }
}
module.exports = UserService