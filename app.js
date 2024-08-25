if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
  }

const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");

const port =8080;

app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "school_managment",
    password: process.env.PASSWORD,
});

// app.get("/addSchool", (req, res) =>{
//     res.send("port working well");
// });

app.get("/addSchool", (req, res) => {
    res.render("create.ejs");
});

app.post("/addSchool", async(req,res) => {
    const {name, address, location, longitude} = req.body;
    let q = `INSERT INTO schools(name, address, latitude, longitude) VALUES(?, ?, ?, ?)`;
    connection.query(q, [name, address, location, longitude], (err,results) => {
      if(err){
        console.error("error executing sql query", err); 
      }else{
        console.log(results);
      }
      res.redirect("/listSchools");
    });
  });

app.get("/listingSchools", (req,res) => {
    let q = `SELECT * FROM schools`;
    try{
        connection.query(q, (err, schools) => {
            if(err) throw  err;
            res.render("listings.ejs", { schools });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in database");
    }
});


app.listen(port, ()=>{
    console.log("listening to port : 8080");
});