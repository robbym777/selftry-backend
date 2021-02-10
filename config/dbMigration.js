const connection = require('./dbConn');
const bcrypt = require('bcryptjs');

const User = require("../src/models/user.model");
const UserAccount = require("../src/models/user.account.model");
const UserProfile = require("../src/models/user.profile.model");
const Fan = require("../src/models/fan.model");
const Friend = require("../src/models/friend.model");
const Content = require("../src/models/content.model");
const Comment = require("../src/models/comment.model");
const Like = require("../src/models/like.model");

const dbAssociation = require('../src/models/index');

async function migration() {
    dbAssociation();
    await connection.sync({ force: true });
    await dataDummy();
}

async function dataDummy() {
    const passwordHash = bcrypt.hashSync('password', 8);

    let user01 = await User.create({
        official: true,
        private: false
    })
    let user02 = await User.create({
        official: false,
        private: true
    })

    let account01 = await UserAccount.create({
        userName: "robby",
        email: "robbymahendra777@gmail.com",
        phoneNumber: "+6281230104211",
        password: passwordHash
    })
    let account02 = await UserAccount.create({
        userName: "ronny",
        email: "ronny@gmail.com",
        phoneNumber: "+6281230104299",
        password: passwordHash
    })

    let profile01 = await UserProfile.create({
        photo: "https://firebasestorage.googleapis.com/v0/b/kotlin-firebase-robby.appspot.com/o/profile%2FLord_Dio.jpg?alt=media&token=c88c72e1-95b9-4fec-8ae5-32d2f2911b2d",
        name: "Robby Mahendra",
        note: "pulstek depeloper",
        gender: "Male",
        birth: "1999-07-21"
    })
    let profile02 = await UserProfile.create({
        photo: "https://firebasestorage.googleapis.com/v0/b/kotlin-firebase-robby.appspot.com/o/profile%2F48d081d62da3712c2e23f981db10ac2c.png?alt=media&token=dd60e1ba-3dd0-42f3-b910-26a876f53a86d",
        name: "Ronny Sugigi",
        note: "abang hekel",
        gender: "Male",
        birth: "1998-03-12"
    })

    let fan01 = await Fan.create({
        person: user01.id
    })
    let fan02 = await Fan.create({
        person: user02.id
    })

    let friend01 = await Friend.create({
        person: user01.id
    })
    let friend02 = await Friend.create({
        person: user02.id
    })

    let content01 = await Content.create({
        title: "Header / Title / Top ",
        caption: "Body / Text / Middle & Bottom",
        picture: "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"
    })
    let content02 = await Content.create({
        title: "JUDUL",
        caption: "ISI",
        picture: "http://guiaavare.com/public/Noticias/3778/2012121702445042adaeaa5d7b8127bfc2c11f3e50b536.jpg"
    })
    let content03 = await Content.create({
        title: "KEPALA",
        caption: "BADAN",
        picture: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Valeriy_Konovalyuk_3x4.jpg"
    })
    let content04 = await Content.create({
        title: "LALALALA",
        caption: "HAHAHAHAHAH",
        picture: "https://sfi.mechatronics.no/wp-content/uploads/2018/09/Foto-3x4-CV-small.jpg"
    })

    let comment01 = await Comment.create({
        person: user01.id,
        text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    })
    let comment02 = await Comment.create({
        person: user02.id,
        text: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
    })
    let comment03 = await Comment.create({
        person: user01.id,
        text: "pendek"
    })
    let comment04 = await Comment.create({
        person: user02.id,
        text: ":)"
    })

    let like01 = await Like.create({
        person: user01.id
    })
    let like02 = await Like.create({
        person: user02.id
    })

    user01.setUserAccount(account01)
    user01.setUserProfile(profile01)
    user01.setFans(fan01)
    user01.setFans(fan02)
    user01.setFriends(friend01)
    user01.setFriends(friend02)
    user01.setContents(content01)
    user01.setContents(content02)
    user01.setContents(content03)
    content01.setComments(comment01)
    content01.setComments(comment02)
    content01.setLikes(like01)
    content02.setLikes(like02)

    user02.setUserAccount(account02)
    user02.setUserProfile(profile02)
    user02.setFans(fan01)
    user02.setFriends(friend01)
    user02.setContents(content04)
    content04.setComments(comment03)
    content04.setComments(comment04)
    content04.setLikes(like01)
}

migration()