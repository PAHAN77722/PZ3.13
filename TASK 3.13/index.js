const express = require("express")
const ejs = require('ejs');
const DatabaseController = require("./controllers/DatabaseController")
const UserController = require("./controllers/UserController")
const client = require("./cache/cache")
const model = require("./models/model")
const passport = require("./passport/passportInit")
const cookieParser = require("cookie-parser")
const expressSession = require("express-session")
const cors = require("cors");
const isLoggedIn = require("./middlewares/isLoggedIn")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.set('views', 'templates');
app.set('view engine', 'ejs');
app.use(express.json())
app.use(expressSession({
    secret: "mofsafdsfdasgfda",
    resave: true,
    saveUninitialized: true
}))

app.use(cors());
app.use(express.json())
app.use(cookieParser("mofsafdsfdasgfda"))

app.use(passport.initialize())
app.use(passport.session())
require("./passport/passportConfig")(passport)


const start = async () => {
    await client.open(process.env.REDIS_HOST)

    app.listen(PORT, () => {
        console.log(`Server start on port ${PORT}`)
    })
}

app.get("/mysql", isLoggedIn, DatabaseController.mysql)
app.get("/redis", isLoggedIn, DatabaseController.redis)
app.get("/login", UserController.loginPage)
app.post("/api/registration", UserController.registration)
app.post("/api/login", UserController.login)
app.get("/registration", UserController.registrationPage)
app.get('/logout', UserController.logout)

start()