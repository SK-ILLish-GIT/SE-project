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
const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    question:{type:String, required:true},
    answer: {type:String, required:true}
});
const Users = mongoose.model("user", userSchema);

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
    const userEmail = req.body.email, userPassword = req.body.password;
    const findUser = async () => {
        try {
            const user = await Users.findOne({ email: userEmail });
            if (user === null)
                res.redirect("/register");
            else {
                if (user.password === userPassword)
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