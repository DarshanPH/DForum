const express = require('express')
const bodyParser = require('body-parser')
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const app = express()
var session = require('express-session');

const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'DForum'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, function (err, success) {
    if (err) {
        return console.log(err)
    }
    const db = success.db(database)

    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));


    app.get("/", function (req, res) {
        res.render("index")
    })


    app.post("/", function (req, res) {
        var name = req.body.name
        var email = req.body.email
        var password = req.body.password
        db.collection("users").find({name:name,email:email,password:password}).toArray(function (err, result) {
            if(result.length > 0 ){
            request.session.loggedin = true;
			request.session.username = name;
            res.redirect("/home")
            } res.send("username or password is incorrect")
        })
    });

    app.post("/home", function (req, res) {
        subject = req.body.subject;
        question = req.body.question;
        known_answer = req.body.known_answer;
        given_answer = req.body.given_answer;
        db.collection('answers').insertOne({subject:subject,question:question,known_answer:known_answer,given_answer:given_answer},function(err,result){
            if(err){
                res.send("unable to insert..! Something goes wrong")
            } res.redirect("/home")
        })
       
    });

    
    app.get("/home", function (req, res) {
        db.collection("questions").find({}).toArray(function (err, result) {
            if (err) {
                console.log("Finding error")
            }
            res.render("home", { allresult: result })
        });
    });



    app.post("/register", function (req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var subject = req.body.subject;
        var mob_num = req.body.mblnumber;
        console.log(name, email, password, subject, mob_num)
        db.collection('users').insertOne({ name: name, email: email, password: password, subject: subject, mob_num: mob_num }, function () {
        })
        res.render("registered")
    });

    app.get("/add-question",function(req,res){
        res.render("add-question");
    });

    app.post("/add-question",function(req,res){
        subject = req.body.subject;
        question = req.body.question;
        shared = req.body.share;
        db.collection('questions').insertOne({subject:subject,question:question,shared:shared}, function(err,result){
            if (err){
                res.send("something goes wrong..!, Data should not inserted")
            } res.redirect("home")
        })
    });

    app.get("/answers",function(req,res){
       res.send("answers")
    });


    app.post("/answers",function(req,res){
    subject = req.body.subject;
    question = req.body.question; 
    known_answer = req.body.known_answer  
    db.collection("answers").find({subject:subject,question:question}).toArray(function (err, result){
        if (err){
            res.send("Unable to find..! or Something goes wrongs")
        }   res.render("answers", { answers:result, subject:subject,question:question, known_answer:known_answer })
    });
    });

}); // Database
app.get("/registered", function (req, res) {
    res.render("registered")
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

