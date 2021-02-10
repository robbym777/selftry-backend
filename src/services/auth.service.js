// const axios = require('axios');
const logEvent = require('../events/myEmitter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
class AuthService {
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
    authInclude = () => {
        return [
            {
                model: this.userAccount,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] }
            },
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
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: this.comment,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: this.like,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                ]
            }
        ]
    }

    async signInManual(user) {
        const { account, password } = user;
        let result;
        try {
            account.match(/@/) != null
                ? result = await this.user.findOne({ include: [{ model: this.userAccount, where: { email: account } }] })
                : result = await this.user.findOne({ include: [{ model: this.userAccount, where: { userName: account } }] })
            if (result) {
                const matchPassword = bcrypt.compareSync(password, result.userAccount.password);
                if (matchPassword) {
                    const user = await this.user.findByPk(result.id, {
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        include: this.authInclude()
                    })
                    // const token = await axios.post('');
                    // const accessToken = token.data.result
                    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
                    result = {
                        userData: user,
                        token: accessToken
                    }
                } else {
                    result = null
                }
            } else {
                result = null
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-SIGN-IN-MANUAL-FAILED',
                logMessage: console.log(e)
            });
            throw new Error(e);
        }
        return result;
    }

    async signInGoogle(user) {
        const { account } = user
        let result;
        try {
            result = await this.user.findOne({ include: [{ model: this.userAccount, where: { email: account } }] })
            if (result) {
                const user = await this.user.findByPk(result.id, {
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    include: this.authInclude()
                })
                // const token = await axios.post('');
                // const accessToken = token.data.result
                const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
                result = {
                    userData: user,
                    token: accessToken
                }
            } else {
                result = null
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-SIGN-IN-GOOGLE-FAILED',
                logMessage: console.log(e)
            });
            throw new Error(e);
        }
        return result;
    }

    async checkAllUser(user) {
        const { userName, email, phoneNumber } = user
        let result;
        let allUsername = []
        let allEmail = []
        let allPhoneNumber = []
        try {
            result = await this.user.findAll({ include: [{ model: this.userAccount }] })
            for (let filter of result) {
                if (filter.userAccount.userName === userName) { allUsername.push(filter.userAccount.userName) }
                if (filter.userAccount.email === email) { allEmail.push(filter.userAccount.email) }
                if (filter.userAccount.phoneNumber === phoneNumber) { allPhoneNumber.push(filter.userAccount.phoneNumber) }
                if (allUsername != "" && allEmail == "" && allPhoneNumber == "") {
                    result = { message: "userName" }
                } else if (allUsername == "" && allEmail != "" && allPhoneNumber == "") {
                    result = { message: "email" }
                } else if (allUsername == "" && allEmail == "" && allPhoneNumber != "") {
                    result = { message: "phoneNumber" }
                } else if (allUsername != "" && allEmail != "" && allPhoneNumber == "") {
                    result = { message: "userNameEmail" }
                } else if (allUsername != "" && allEmail == "" && allPhoneNumber != "") {
                    result = { message: "userNamePhoneNumber" }
                } else if (allUsername == "" && allEmail != "" && allPhoneNumber != "") {
                    result = { message: "emailPhoneNumber" }
                } else if (allUsername != "" && allEmail != "" && allPhoneNumber != "") {
                    result = { message: "userNameEmailPhoneNumber" }
                } else {
                    result = { message: "OK" }
                }
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-CHECK-ALL-USER-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }

    async changePassword(user) {
        const { phoneNumber } = user
        let result
        try {
            result = await this.user.findOne({ include: [{ model: this.userAccount, where: { phoneNumber: phoneNumber } }] })
            if (result && result.userAccount.phoneNumber == phoneNumber) {
                const tokenAccess = jwt.sign({ id: result.id }, process.env.SECRET_KEY)
                result = {
                    token: tokenAccess
                }
            } else {
                result = null
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: '(SERVICE)-CHANGE-PASSWORD-FAILED',
                logMessage: console.log(e)
            })
            throw new Error(e)
        }
        return result
    }
}

module.exports = AuthService