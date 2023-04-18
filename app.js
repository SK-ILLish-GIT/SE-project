const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
//*******************for passport**************************
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const puppeteer = require("puppeteer");
// const nodemailer = require('nodemailer');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
// let currUser=null;
//******************** for passport ******************************************
app.use(
  session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//////////////////////////////Mongoose connection and Schema////////////////////////////////////////////////////////
const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/PortfolioDB");
    console.log("Server Connected");
  } catch (err) {
    console.log(err);
  }
};
connect();

const basicInfoSchema = mongoose.Schema({
  name: String,
  birthdate: Date,
  email: String,
  phoneNo: String,
  gender: String,
});
const basicInfo = mongoose.model("basicInfo", basicInfoSchema);
const addressInfoSchema = mongoose.Schema({
  address: String,
  city: String,
  state: String,
  zipCode: Number,
});
const addressInfo = mongoose.model("addressInfo", addressInfoSchema);
const skillsInfoSchema = mongoose.Schema({
  technicalSkills: [String],
  nontechnicalSkills: [String],
});
const skillInfo = mongoose.model("skillInfo", skillsInfoSchema);
const loginInfoSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  securityQuestion: String,
  answer: String,
});
const loginInfo = mongoose.model("loginInfo", loginInfoSchema);
const projectSchema = mongoose.Schema({
  name: [String],
  domain: [String],
  technologies: [String],
  githubRepo: [String],
});
const projects = mongoose.model("project", projectSchema);
const hobbiesInfoSchema = mongoose.Schema({
  sports: [String],
  others: [String],
});
const educationInfoSchema = mongoose.Schema({
  hsName: String,
  hsStart: Date,
  hsEnd: Date,
  hsPercentage: String,
  cName: String,
  cStart: Date,
  cEnd: Date,
  cCg: String,
  cBranch: String,
});
const educationInfo = mongoose.model("education", educationInfoSchema);
const hobbies = mongoose.model("hobbies", hobbiesInfoSchema);

//********************************************************************************************************
// const userIdentificationSchema = new mongoose.Schema({
//     userName:String,
//     password:String
// });

// userIdentificationSchema.plugin(passportLocalMongoose);

// const myUser  = mongoose.model("myUser",userIdentificationSchema);
//**********************************************************************************************************

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  basicInfo: basicInfoSchema,
  addressInfo: addressInfoSchema,
  skillsInfo: skillsInfoSchema,
  loginInfo: loginInfoSchema,
  projectInfo: projectSchema,
  hobbiesInfo: hobbiesInfoSchema,
  educationInfo: educationInfoSchema,
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("user", userSchema);

// const Zia = new Users({
//     email: "IIB2021027@iiita.ac.in",
//     password: "027",
//     question: "Your dog name",
//     answer: "piyush"
// });
// const Sahil = new Users({
//     email: "IIB2021038@iiita.ac.in",
//     password: "038",
//     question: "Your dog name",
//     answer: "piyush"
// });
// Users.insertMany([Zia, Sahil]).catch((error) => {
//     console.log("Error in adding admins - " + error);
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/LogIn/login.html");
});
app.get("/sign-in", (req, res) => {
  res.sendFile(__dirname + "/LogIn/sign_in.html");
});
app.get("/home", (req, res) => {
  if (req.user) {
    res.render("home");
  } else {
    res.redirect("/sign-in");
  }
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/Form_page/index.html");
});
app.get("/contact",(req,res)=>{
    res.sendFile(__dirname+"/Contact_us/index.html");
});

app.get("/sign-in/security", (req, res) => {
  res.render("security_question");
});

app.get("/feedback",(req,res)=>{
  res.sendFile(__dirname+"/feedback/feedback.html");
})

app.get("/info", (req, res) => {
  if (req.user) {
    // console.log(req.user);
    const getDocument = async () => {
      try {
        const foundUser = await user.findOne({ username: req.user.username });
        res.render("info", { currUser: foundUser });
      } catch (e) {
        console.log(e);
      }
    };

    getDocument();
  } else {
    res.redirect("/sign-in");
  }
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/sign-in");
  });
});

app.get("/change", (req, res) => {
  if (req.user) {
    // console.log(req.user);
    const getDocument = async () => {
      try {
        const foundUser = await user.findOne({ username: req.user.username });
        res.render("change", { currUser: foundUser });
      } catch (e) {
        console.log(e);
      }
    };

    getDocument();
  } else {
    res.redirect("/sign-in");
  }
});

app.post("/register", (req, res) => {
  console.log(req.body);
  const newUserBasicInfo = new basicInfo({
    name: req.body.name,
    birthdate: req.body.birthdate,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    gender: req.body.gender,
  });
  newUserBasicInfo.save();
  const newUserAddressInfo = new addressInfo({
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
  });
  newUserAddressInfo.save();

  const newUserSkillsInfo = new skillInfo({
    technicalSkills: req.body.user_tech,
    nontechnicalSkills: req.body.user_non_tech,
  });
  newUserSkillsInfo.save();

  const newUserLoginInfo = new loginInfo({
    username: req.body.userName,
    password: req.body.password,
    securityQuestion: req.body.securityQuestion,
    answer: req.body.answer,
  });
  newUserLoginInfo.save();
  const newUserProjects = new projects({
    name: req.body.Pname,
    domain: req.body.domain,
    technologies: req.body.techonologies,
    githubRepo: req.body.githubRepo,
  });
  newUserProjects.save();

  const newUserSports = [];
  if (req.body.cricket != undefined) newUserSports.push("Cricket");
  if (req.body.football != undefined) newUserSports.push("Football");
  if (req.body.basketBall != undefined) newUserSports.push("Basket Ball");

  const newUserOtherHobbies = [];
  if (req.body.music != undefined) newUserOtherHobbies.push("Music");
  if (req.body.arts != undefined) newUserOtherHobbies.push("Arts");

  newUserOtherHobbies.push(req.body.otherHobbies);

  const newUserHobbiesInfo = new hobbies({
    sports: newUserSports,
    others: newUserOtherHobbies,
  });
  newUserHobbiesInfo.save();

  const newUserEducationInfo = new educationInfo({
    hsName: req.body.hsName,
    hsStart: req.body.hsStart,
    hsEnd: req.body.hsEnd,
    hsPercentage: req.body.hsPercentage,
    cName: req.body.cName,
    cStart: req.body.cStart,
    cEnd: req.body.cEnd,
    cCg: req.body.cCg,
    cBranch: req.body.cBranch,
  });
  newUserEducationInfo.save();

  const newUser = new user({
    username: req.body.userName,
    password: req.body.password,
    basicInfo: newUserBasicInfo,
    addressInfo: newUserAddressInfo,
    skillsInfo: newUserSkillsInfo,
    loginInfo: newUserLoginInfo,
    projectInfo: newUserProjects,
    hobbiesInfo: newUserHobbiesInfo,
    educationInfo: newUserEducationInfo,
  });
  user.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        console.log("user is authenticated");
        res.redirect("/sign-in");
      });
    }
  });
});
app.post("/sign-in/security", (req, res) => {
  const userEmail = req.body.email,
    userAnswer = req.body.answer;
  const findUser = async () => {
    try {
      const user = await Users.findOne({ email: userEmail });
      if (user === null) res.redirect("/register");
      else {
        if (user.answer === userAnswer) res.redirect("/home");
        else res.send("<h1>Wrong answer</h1>");
      }
    } catch (error) {
      console.log("Error in finding user - " + error);
    }
  };
  findUser();
});

app.post("/sign-in", (req, res) => {
  const newUser = new user({
    username: req.body.userName,
    password: req.body.password,
  });
  req.login(newUser, function (err) {
    if (err) {
      res.redirect("/sign-in");
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/home");
      });
    }
  });
});
app.post("/search", (req, res) => {
  const searchUser = req.body.search;
  const findUser = async () => {
    try {
      const newCurrUser = await user.findOne({ username: searchUser });
      if (newCurrUser === null) res.redirect("/home");
      else {
        res.render("info", { currUser: newCurrUser });
      }
    } catch (error) {
      console.log("Error in searching user - " + error);
    }
  };
  findUser();
});

// *********************************************update************************************
app.post("/info", (req, res) => {
  if (req.user) {
    const getDocument = async () => {
      try {
        const foundUser = await user.findOne({ username: req.user.username });
        res.render("change", { currUser: foundUser });
      } catch (e) {
        console.log(e);
      }
    };
    getDocument();
  } else {
    res.redirect("/sign-in");
  }
});

app.post("/change", (req, res) => {
  if (req.user) {
    const getDocument = async () => {
      try {
       const foundUser = await user.findOne({ username: req.user.username });
        res.render("change", { currUser: foundUser });

        console.log(req.body);
    const user_name = req.body.name ||  foundUser.name;
    // const user_password = req.body.name ||  foundUser.name;
    const user_birthdate = req.body.birthdate ||  foundUser.birthdate;
    const user_email = req.body.email ||  foundUser.email;
    const user_phone = req.body.phoneNo ||  foundUser.phoneNo;
    const user_address = req.body.address ||  foundUser.address;
    // const user_city = req.body.city ||  foundUser.city;
    // const user_zipCode = req.body.zipCode ||  foundUser.zipCode;
    // const user_state = req.body.state ||  foundUser.state;
    // const user_tech_skill = new Array(req.body.user_tech ||  foundUser.user_tech);
    // const user_non_tech_skill = new Array(req.body.user_non_tech ||  foundUser.user_non_tech);
    // const user_hsName = req.body.hsName ||  foundUser.hsName;
    // const user_hsStart = req.body.hsStart ||  foundUser.hsStart;
    // const user_hsEnd = req.body.hsEnd ||  foundUser.hsEnd;
    // const user_hsPercentage = req.body.hsPercentage ||  foundUser.hsPercentage;
    // const user_cName = req.body.cName ||  foundUser.cName;
    // const user_cBranch = req.body.cBranch ||  foundUser.cBranch;
    // const user_cCg = req.body.cCg ||  foundUser.cCg;
    // const user_otherHobbies = req.body.otherHobbies ||  foundUser.otherHobbies;
    // const user_cEnd = req.body.cEnd ||  foundUser.cEnd;
    // const user_cEnd = req.body.cEnd ||  foundUser.cEnd;


    

    // console.log(user_name);
    try {
      const updateDocument = async(_id)=>{
        const result = await user.updateOne({_id},{
          $set:{
            name:user_name,
            birthdate:user_birthdate,
            email:user_email,
            phoneNo:user_phone,
            address:user_address
            // city:user_city
          }
        })
      }
      updateDocument(foundUser._id);
    } catch (e) {
      console.log(e);
    }
    res.redirect("/info");

      } catch (e) {
        console.log(e);
      }
    };

    getDocument();

  } else {
    res.redirect("/sign-in");
  }
});
// ***************************************************************************************

//////////////////////////////nodemailer//////////////////////////////////

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'sksahilparvez2000@gmail.com',
//         pass: '3$GSi!j66rdK$c!6Pnn#M95nz6#'
//     }
// });

// var mailOptions = {
//     from: 'sksahilparvez2000@gmail.com',
//     to: 'iib2021038@iiita.ac.in',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });
// "use strict";
// const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: testAccount.user, // generated ethereal user
//             pass: testAccount.pass, // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: '"Fred Foo 👻" <foo@example.com>', // sender address
//         to: "bar@example.com, baz@example.com", // list of receiversa
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);

app.listen(3000, (req, res) => {
  console.log("Server running");
});
