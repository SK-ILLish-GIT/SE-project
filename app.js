const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
// const nodemailer = require('nodemailer');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


//////////////////////////////Mongoose connection and Schema////////////////////////////////////////////////////////
const connect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/PortfolioDB');
        console.log("Server Connected");
    }
    catch (err) {
        console.log(err);
    }
}
connect();

const basicInfoSchema=mongoose.Schema({
    name:String,
    birthdate:Date,
    email:String,
    phoneNo:String,
    gender:String
});
const basicInfo=mongoose.model("basicInfo",basicInfoSchema);
const addressInfoSchema=mongoose.Schema({
    address:String,
    city:String,
    state:String,
    zipCode:Number
});
const addressInfo=mongoose.model("addressInfo",addressInfoSchema);
const skillsInfoSchema=mongoose.Schema({
    skills:[String]
});
const skillInfo=mongoose.model("skillInfo",skillsInfoSchema);
const loginInfoSchema=mongoose.Schema({
    userName:{ type: String, required: true },
    password:{ type: String, required: true },
    securityQuestion:String,
    answer:String
});
const loginInfo=mongoose.model("loginInfo",loginInfoSchema);
const projectSchema=mongoose.Schema({
    topic:[String],
    technologies:[String],
    githubRepo:[String]
});
const projects=mongoose.model("project",projectSchema);
const hobbiesInfoSchema=mongoose.Schema({
    sports:[String],
    others:[String]
});
const hobbies=mongoose.model("hobbies",hobbiesInfoSchema);
const userSchema = mongoose.Schema({
    userName:String,
    password:String,
    basicInfo:basicInfoSchema,
    addressInfo:addressInfoSchema,
    skillsInfo:skillsInfoSchema,
    loginInfo:loginInfoSchema,
    projectInfo:projectSchema,
    hobbiesInfo:hobbiesInfoSchema
});
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
    res.render("home");
});
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/Form_page/index.html");
})
app.get("/sign-in/security",(req,res)=>{
    res.render("security_question");
});

app.post("/register",(req,res)=>{
        const newUserBasicInfo=new basicInfo({
            name:req.body.name,
            birthdate:req.body.birthdate,
            email:req.body.email,
            phoneNo:req.body.phoneNo,
            gender:req.body.gender
        });
        newUserBasicInfo.save();
        const newUserAddressInfo=new addressInfo({
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zipCode:req.body.zipCode
        });
        newUserAddressInfo.save();

        const newUserSkillsInfo=new skillInfo({
            skills:[req.body.skill1,req.body.skill2,req.body.skill3,req.body.skill4]
        });
        newUserSkillsInfo.save();

        const newUserLoginInfo=new loginInfo({
            userName:req.body.userName,
            password:req.body.password,
            securityQuestion:req.body.securityQuestion,
            answer:req.body.answer
        });
        newUserLoginInfo.save();
        const newUserProjects=new projects({
            topic:req.body.topic,
            technologies:req.body.techonologies,
            githubRepo:req.body.githubRepo
        });
        newUserProjects.save();

        const newUserSports=[];
        if(req.body.cricket!=undefined)
        newUserSports.push("Cricket");
        if(req.body.football!=undefined)
        newUserSports.push("Football");
        if(req.body.basketBall!=undefined)
        newUserSports.push("Basket Ball");
        if(req.body.other!=undefined)
        newUserSports.push("Other");

        const newUserOtherHobbies=[];
        if(req.body.music!=undefined)
        newUserOtherHobbies.push("Music");
        if(req.body.arts!=undefined)
        newUserOtherHobbies.push("Arts");

        newUserOtherHobbies.push(req.body.otherHobbies);

        const newUserHobbiesInfo=new hobbies({
            sports:newUserSports,
            others:newUserOtherHobbies
        });
        newUserHobbiesInfo.save();

        const newUser=new user({
            userName:req.body.userName,
            password:req.body.password,
            basicInfo:newUserBasicInfo,
            addressInfo:newUserAddressInfo,
            skillInfo:newUserSkillsInfo,
            loginInfo:newUserLoginInfo,
            projectInfo:newUserProjects,
            hobbiesInfo:newUserHobbiesInfo 
        });
        newUser.save();

        res.redirect("/sign-in");

});
app.post("/sign-in/security",(req,res)=>{
    const userEmail = req.body.email, userAnswer = req.body.answer;
    const findUser = async () => {
        try {
            const user = await Users.findOne({ email: userEmail });
            if (user === null)
                res.redirect("/register");
            else {
                if (user.answer === userAnswer)
                    res.redirect("/home");
                else
                    res.send("<h1>Wrong answer</h1>");
            }
        }
        catch (error) {
            console.log("Error in finding user - " + error);
        }

    };
    findUser();
});

app.post("/sign-in", (req, res) => {
    // console.log(req.body);
    const currUserName = req.body.userName, currUserPassword = req.body.password;
    const findUser = async () => {
        try {
            const currUser = await user.findOne({ userName: currUserName });
            if (currUser === null)
                res.redirect("/register");
            else {
                if (currUser.password === currUserPassword)
                    res.redirect("/home");
                else
                    res.send("<h1>Wrong password</h1>");
            }
        }
        catch (error) {
            console.log("Error in finding user - " + error);
        }

    };
    findUser();
});

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
//         to: "bar@example.com, baz@example.com", // list of receivers
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