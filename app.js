const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

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
    password: { type: String, required: true }
});
const Users = mongoose.model("user", userSchema);

// const Zia = new Users({
//     email: "IIB2021027@iiita.ac.in",
//     password: "027"
// });
// const Sahil = new Users({
//     email: "IIB2021038@iiita.ac.in",
//     password: "038"
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


app.post("/sign-in", (req, res) => {
    // console.log(req.body);
    const userEmail = req.body.email, userPassword = req.body.password;
    const findUser = async () => {
        try {
            const user = await Users.findOne({ email: userEmail });
            if (user === null)
                res.send("<h1>NO such user</h1>");
            else {
                if (user.password === userPassword)
                    res.send("<h1>Singed in sucessfully</h1>");
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