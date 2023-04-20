const {User} = require("../models/model")
const bcrypt = require("bcrypt")
const {response} = require("express");
const localStrategy = require("passport-local").Strategy

module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({where: {username: username}}).then(response => {
                if(!response) {
                    return done(null, false)
                }
                bcrypt.compare(password, response.dataValues.password, (err, result) => {
                    if(err) throw err
                    if(result === true) {
                        return done(null, response.dataValues)
                    } else {
                        return done(null, false)
                    }
                })
            })
        })
    )

    passport.serializeUser((user, cb) => {
        cb(null, user.id)
    })

    passport.deserializeUser((id, cb) => {
        User.findOne({where: {id: id}})
            .then(response => {
                cb(null, response.dataValues)
            })
    })
}