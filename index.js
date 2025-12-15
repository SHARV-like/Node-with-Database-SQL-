const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const { read } = require('fs');
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("/public/style.css"));
app.use(express.urlencoded({ extended: true })); // form data
app.use(methodOverride("_method"));



const port = 8080;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'devapp',
    password: "@paparocks2006@"
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}


app.get("/user", (req, res) => {
    let q = "SELECT COUNT(*) FROM user";
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            console.log(results[0]["COUNT(*)"]);
            res.render("home.ejs", { results });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
})

app.get("/show", (req, res) => {
    let q = "SELECT * FROM user";
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            // console.log(results);
            // res.send(results);
            res.render("show.ejs", { users });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
})

app.get("/user/:id/edit", (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    let q = "SELECT * FROM user WHERE id = ?";
    try {
        connection.query(q, [id], (err, users) => {
            if (err) throw err;
            console.log(users);
            let user = users[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
    }
})

app.patch("/user/:id", (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    // let update = [username, email, id];
    const q1 = `SELECT * FROM user WHERE id = "${id}"`;
    connection.query(q1, (err, user) => {
        if (err) return res.send("DB error");
        if (user[0].password != password) {
            res.send("Password incorrect !!");
        } else {
            const q2 = "UPDATE user SET username = ?, email = ? WHERE id = ?"
            let update = [username, email, id];
            try {
                connection.query(q2, update, (err, users) => {
                    if (err) throw err;
                    res.redirect("/show");
                });
            }catch(err){
                res.send("DB error !!");
            }
        }
    });
});


app.listen(port, () => {
    console.log(`App is listenig on port : ${port}`);
});



// try{
//     connection.query(q, [users], (err, results) => {
//     if(err) throw err;
//     console.log(results);
// });
// }catch(err){
//     console.log(err);
// }

