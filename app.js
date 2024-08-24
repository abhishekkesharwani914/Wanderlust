if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./Models/user.js")

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbURL);
};


app.set("view eingine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));//to psrse the data from the parms
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // used for boilerplate code
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret: process.env.SECRET
    },
    touchAfter: 24 *3600,
});

store.on("error", (err) =>{
    console.log("ERROR IN MONGO SESSION",err);
});

const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());  //setting up the flash means user will get some msg when he log in or other activity after that it deletes from the memory

app.use(passport.initialize());//A middleware that initializes the passport
app.use(passport.session());// session is used to store the user data in the memory
passport.use(new LocalStrategy(User.authenticate)); // passport-local Mongoose package use local strategy to user authenticate which Generates a function that is used in Passport's LocalStrategy

passport.serializeUser(User.serializeUser());// passport-local Mongoose package use serializeUser which Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());// passport-local Mongoose package use deserializer which Generates a function that is used by Passport to deserialize users into the session

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async (req, res) =>{
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "abhishekkesharwani914"
//     });
//     let registeredUser = await User.register(fakeUser, "Helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404,"Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrongz"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to the port : 8080");
});