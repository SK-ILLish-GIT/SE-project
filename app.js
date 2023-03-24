const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

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
app.get("/register",(req,res)=>{
    res.sendFile(__dirname+"/Form_page/index.html");
})

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






app.listen(3000, (req, res) => {
    console.log("Server running");
});