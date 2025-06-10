
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const PORT = 3000;

const app = express();

app.use(cors()); // Allow requests from frontend (e.g., running on Live Server)
app.use(express.json()); // <-- CRITICAL: Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Allow parsing URL-encoded bodies too

//rendering all the necessary files from my back end app.
app.get('/',  (req, res) => { res.sendFile(path.join(__dirname, 'studentPage.html')); });
app.get('/Elandingpage.html', (req, res) => { res.sendFile(path.join(__dirname, 'Elandingpage.html')); });
app.get('/studentPage.html', (req, res) => { res.sendFile(path.join(__dirname, 'studentPage.html'));});
app.get('/teacherPage.html', (req, res) => { res.sendFile(path.join(__dirname, 'teacherPage.html'));});
app.get('/PHOTO-2025-05-28-23-16-51.jpg', (req, res) => { res.sendFile(path.join(__dirname, 'PHOTO-2025-05-28-23-16-51.jpg'));});
app.get('/thankyou.html', (req, res) => { res.sendFile(path.join(__dirname, 'thankyou.html'));});
app.get('/survey.html', (req, res) => { res.sendFile(path.join(__dirname, 'survey.html'));});





//create connection with my existing database
/*const db = mysql.createPool({
    host: "localhost",
    user: "ulrichKiff",
    password: "ulrichKiff7",
    database: "ULShop"
});

//this is the table of staff
const createClientTable = `
CREATE TABLE IF NOT EXISTS client (
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    role VARCHAR(200) DEFAULT "student",
    password VARCHAR(200) NOT NULL
);
`

db.query(createClientTable, (err, result) => {
    console.log("client table crerated or already exists");
if (err) {
    console.error("Error creating table:", err);
    throw err; // Stop server if table creation fails initially
 }
});*/

app.post("/api-login", (req, res)=>{
    const {mail, pass} = req.body;
    console.log(`email:${mail} and password:${pass} from the front end`);

    const findUser = `SELECT * FROM client WHERE email = ? AND password = ?`;

    db.query(findUser, [mail, pass], (err, results)=> {

        if (err) {
            console.error('Server error:', err);
            return res.status(500).json({ message: "Sorry, there is an error in the database or server" });
        }

        if (results.length>0){
            const client = results[0];
            return res.status(200).json({role:client.role, message: "success" });
        }else{
            return res.status(404).json({ message: "Invalid email or password" });
        }
    })
})

app.put("/api-register", (req, res)=>{
    const {mail, fname, lname, pass} = req.body;

    const findUser = `SELECT * FROM client WHERE email = ?`;

    db.query(findUser, [mail], (err, results)=> {

        if (err) {
            console.error('Server error:', err);
            return res.status(500).json({ message: "Sorry, there is an error in the database or server" });
        }

        if (results.length>0){
            return res.status(400).json({message: "A user with this email already exists"});
        }else{
            const addToDatabase = `INSERT INTO client (firstname, lastname, email, password) VALUES (?,?,?,?)`;

            db.query(addToDatabase, [fname, lname, mail, pass], (err)=>{
                if (err) {
                    return res.status(400).json({ message: "Sorry, there is a serious error in the database" });
                }
            })
            return res.status(200).json({ message: "success" });
        }
    })
})



app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ message: 'Something broke on the server!' });
});

//starting the server.
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully on http://localhost:${PORT}`);
});
