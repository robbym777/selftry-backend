const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
// const axios = require('axios');

const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');

jest.mock('../models/user.model');
jest.mock('../models/user.account.model');
jest.mock('../models/user.profile.model');
jest.mock('../models/fan.model');
jest.mock('../models/friend.model');
jest.mock('../models/content.model');
jest.mock('../models/comment.model');
jest.mock('../models/like.model');

const User = require("../models/user.model");
const UserAccount = require("../models/user.account.model");
const UserProfile = require("../models/user.profile.model");
const Fan = require("../models/fan.model");
const Friend = require("../models/friend.model");
const Content = require("../models/content.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model");

let authService;
let userService;

let user;
let userAccount;
let userProfile;
let fan;
let friend;
let content;
let comment;
let like;

let login;
let gmail;
let filtering;
let phone;

let newUser;

describe('Service Testing', () => {
    beforeAll(() => {
        user = new User;
        userAccount = new UserAccount;
        userProfile = new UserProfile;
        fan = new Fan;
        friend = new Friend;
        content = new Content;
        comment = new Comment;
        like = new Like;

        authService = new AuthService(user, userAccount, userProfile, fan, friend, content, comment, like);
        userService = new UserService(user, userAccount, userProfile, fan, friend, content, comment, like);
    });
    describe('Authentication Service', () => {
        beforeAll(() => {
            login = {
                account: "robby",
                password: "password"
            }
            gmail = {
                email: "robbymahendra777@gmail.com"
            }
            filtering = {
                userName: "userA",
                email: "user@gmail.com",
                phoneNumber: "+6210202353"
            }
            phone = {
                phoneNumber: "+62081234567"
            }
        });

        // All include
        it('show all included model in auth service', async () => {
            const include = await authService.authInclude()
            expect(include).toBeTruthy();
        });

        // SignInManual
        it('return data and token when SignInManual', async () => {
            user.findOne = jest.fn(() => {
                return {
                    userAccount: {
                        password: "password"
                    }
                }
            });
            bcrypt.compareSync = jest.fn(() => {
                return true
            });
            user.findByPk = jest.fn(() => {
                return {
                    id: "available"
                }
            });
            jwt.sign = jest.fn(() => {
                return "token"
            });
            const data = await authService.signInManual(login);
            expect(user.findOne).toBeCalledTimes(1);
            expect(user.findByPk).toBeCalledTimes(1);
            expect(data).toBeTruthy();
        });
        it('search by userName or Email (null) on SignInManual', async () => {
            const data = await authService.signInManual(login);
            expect(login.account.match(/@/)).toBeNull();
            expect(data).toBeTruthy();
        });
        it('search by userName or Email on SignInManual', async () => {
            let login = { account: "robbymahendra777@gmail.com", password: "password" }
            const data = await authService.signInManual(login);
            expect(login.account.match(/@/)).toEqual(expect.arrayContaining(["@"]));
            expect(data).toBeTruthy();
        });
        it('if the password does not match on SignInManual', async () => {
            user.findOne = jest.fn(() => {
                return {
                    userAccount: {
                        password: "password"
                    }
                }
            });
            bcrypt.compareSync = jest.fn(() => {
                return false
            });
            const data = await authService.signInManual(login);
            expect(user.findOne).toBeCalledTimes(1);
            expect(data).toBeNull();
        });
        it('if the account not registered on SignInManual', async () => {
            user.findOne = jest.fn(() => {
                return null
            });
            const data = await authService.signInManual(login);
            expect(user.findOne).toBeCalledTimes(1);
            expect(data).toBeNull();
        });
        it('throw data error when SignInManual', async () => {
            user.findOne = jest.fn(() => {
                throw new Error('Failed to fetch user for login')
            });
            try {
                await authService.signInManual(login);
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual('Error: Failed to fetch user for login');
            expect(user.findOne).toBeCalledTimes(1);
        });

        // SignInGoogle
        it('return data and token when SignInGoogle', async () => {
            user.findOne = jest.fn(() => {
                return true
            });
            user.findByPk = jest.fn(() => {
                return user
            });
            jwt.sign = jest.fn(() => {
                return "token"
            });
            const data = await authService.signInGoogle(gmail);
            expect(user.findOne).toBeCalledTimes(1);
            expect(user.findByPk).toBeCalledTimes(1);
            expect(data).toBeTruthy();
        });
        it('if the account not registered on SignInGoogle', async () => {
            user.findOne = jest.fn(() => {
                return null
            });
            const data = await authService.signInGoogle(gmail);
            expect(user.findOne).toBeCalledTimes(1);
            expect(data).toBeNull();
        });
        it('throw data error when SignInGoogle', async () => {
            user.findOne = jest.fn(() => {
                throw new Error('Failed to fetch user for login')
            });
            try {
                await authService.signInGoogle(gmail);
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual('Error: Failed to fetch user for login');
            expect(user.findOne).toBeCalledTimes(1);
        });

        // CheckAllUser
        it('return {userName} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "userA",
                            email: "users@gmail.com",
                            phoneNumber: "+621020233"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "userName" })
        });
        it('return {email} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "user",
                            email: "user@gmail.com",
                            phoneNumber: "+621020233"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "email" })
        });
        it('return {phoneNumber} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "user",
                            email: "users@gmail.com",
                            phoneNumber: "+6210202353"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "phoneNumber" })
        });
        it('return {userNameEmail} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "userA",
                            email: "user@gmail.com",
                            phoneNumber: "+621020233"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "userNameEmail" })
        });
        it('return {userNamePhoneNumber} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "userA",
                            email: "users@gmail.com",
                            phoneNumber: "+6210202353"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "userNamePhoneNumber" })
        });
        it('return {emailPhoneNumber} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "user",
                            email: "user@gmail.com",
                            phoneNumber: "+6210202353"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "emailPhoneNumber" })
        });
        it('return {userNameEmailPhoneNumber} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "userA",
                            email: "user@gmail.com",
                            phoneNumber: "+6210202353"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "userNameEmailPhoneNumber" })
        });
        it('return {OK} after filtering user account', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userAccount: {
                            userName: "user",
                            email: "users@gmail.com",
                            phoneNumber: "+621020233"
                        }
                    }
                ]
            });
            const data = await authService.checkAllUser(filtering);
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual({ message: "OK" })
        });
        it('throw data error when CheckAllUser', async () => {
            user.findAll = jest.fn(() => {
                throw new Error('Failed to fetch user for filter')
            });
            try {
                await authService.checkAllUser(filtering);
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual('Error: Failed to fetch user for filter');
            expect(user.findOne).toBeCalledTimes(1);
        });

        // ChangePassword
        it('return token when changePassword', async () => {
            user.findOne = jest.fn(() => {
                return {
                    userAccount: {
                        phoneNumber: "+62081234567"
                    }
                }
            });
            jwt.sign = jest.fn(() => {
                return "token"
            });
            const data = await authService.changePassword(phone);
            expect(user.findOne).toBeCalledTimes(1)
            expect(data).toEqual({ token: "token" })
        });
        it('return null when changePassword', async () => {
            user.findOne = jest.fn(() => {
                return null
            });
            const data = await authService.changePassword(phone);
            expect(user.findOne).toBeCalledTimes(1)
            expect(data).toBeNull()
        });
        it('throw data error when ChangePassword', async () => {
            user.findOne = jest.fn(() => {
                throw new Error('Failed to fetch user for change password')
            });
            try {
                await authService.changePassword(phone);
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual('Error: Failed to fetch user for change password');
            expect(user.findOne).toBeCalledTimes(1);
        });
    });

    describe('User Service', () => {
        beforeAll(() => {
            newUser = {
                userAccount: {
                    userName: "test",
                    email: "test@gmail.com",
                    phoneNumber: "+62012345678",
                    password: "password"
                },
                userProfile: {
                    photo: "???",
                    background: "????",
                    name: "test",
                    note: "testing",
                    gender: "Male",
                    birth: "1999-99-99"
                }
            }
        });

        // All include
        it('show all included model in user service', async () => {
            const include = await userService.userInclude()
            expect(include).toBeTruthy();
        });
        it('show all included (with arguments) model in user service', async () => {
            const include = await userService.userInclude("robby")
            expect(include).toBeTruthy();
        });

        // GetAllUser
        it('return all data user on GetAllUsers', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        id: "1"
                    }
                ]
            });
            const data = await userService.getAllUsers();
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual(expect.arrayContaining([{ id: "1" }]));
        });
        it('throw error when GetAllUsers failed', async () => {
            user.findAll = jest.fn(() => {
                throw new Error('Failed to get all users')
            })
            try {
                await userService.getAllUsers()
            } catch (e) {
                message = e.message
            }
            expect(message).toEqual(`Error: Failed to get all users`);
            expect(user.findAll).toBeCalledTimes(1);
        });

        // GetByID
        it('return data user on GetByID', async () => {
            user.findByPk = jest.fn(() => {
                return {
                    id: "1"
                }
            });
            const data = await userService.getByID("1");
            expect(user.findByPk).toBeCalledTimes(1);
            expect(data).toEqual({ id: "1" });
        });
        it('throw error when GetByID failed', async () => {
            user.findByPk = jest.fn(() => {
                throw new Error('Failed to get user by id')
            })
            try {
                await userService.getByID()
            } catch (e) {
                message = e.message
            }
            expect(message).toEqual(`Error: Failed to get user by id`);
            expect(user.findByPk).toBeCalledTimes(1);
        });

        // GetByUsername
        it('return data user on GetByUsername', async () => {
            user.findAll = jest.fn(() => {
                return [
                    {
                        userName: "ro"
                    }
                ]
            });
            const data = await userService.getByUsername("r");
            expect(user.findAll).toBeCalledTimes(1);
            expect(data).toEqual(expect.arrayContaining([{ userName: "ro" }]));
        });
        it('throw error when GetByUsername failed', async () => {
            user.findAll = jest.fn(() => {
                throw new Error('Failed to get user by username')
            })
            try {
                await userService.getByUsername()
            } catch (e) {
                message = e.message
            }
            expect(message).toEqual(`Error: Failed to get user by username`);
            expect(user.findAll).toBeCalledTimes(1);
        });

        // PostUser
        it('failed create new user on PostUser', async () => {
            const mUser = { setUserAccount: jest.fn(), setUserProfile: jest.fn() }
            user.create = jest.fn().mockResolvedValueOnce(mUser)
            userAccount.create = jest.fn().mockResolvedValueOnce(newUser.userAccount)
            userProfile.create = jest.fn().mockResolvedValueOnce(newUser.userProfile)
            jwt.sign = jest.fn(() => {
                return "token"
            })
            const data = await userService.postUser(newUser);
            expect(user.create).toBeCalledTimes(1);
            expect(userAccount.create).toBeCalledTimes(1);
            expect(userProfile.create).toBeCalledTimes(1);
            expect(mUser.setUserAccount).toBeCalledWith(newUser.userAccount)
            expect(mUser.setUserProfile).toBeCalledWith(newUser.userProfile)
            expect(data).toEqual({ token: "token" })
        });
        it('failed create new user on PostUser', async () => {
            user.create = jest.fn(() => {
                throw new Error("Failed create new user")
            });
            try {
                await userService.postUser(newUser);
            } catch (e) {
                message = e.message;
            }
            expect(message).toEqual('Error: Failed create new user')
            expect(user.create).toBeCalledTimes(1);
        });
    });
})