const {User} = require("../models/model")
const bcrypt = require("bcrypt");
const {response} = require("express");
const passport = require("../passport/passportInit");

class UserController {
    async login(req, res, next) {
        passport.authenticate("local", (err, user, info) => {
            if(err) throw err
            if(!user) res.json({message: "No user exists", isSuccess: false})
            else {
                req.logIn(user, (err) => {
                    if(err) throw err
                    res.json({message: "Success Authenticated", isSuccess: true})
                })
            }
        })(req, res, next)
    }

    async registration(req, res, next) {
        const user = await User.findOne({where: {username: req.body.username}})
        if (user !== null) {
            res.status(200).json({message: `User with name ${req.body.username} already exists`})
        } else {
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = await User.create({username: req.body.username, password: hashPassword})
            res.json(newUser)
        }
    }

    async logout(req, res, next) {
        req.logout(() => {
            res.redirect('/login');
        });
    }

    async loginPage(req, res, next) {
        res.render("login.ejs")
    }

    async registrationPage(req, res, next) {
        res.render("registration.ejs")
    }
}

module.exports = new UserController()