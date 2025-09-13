const express = require('express')
const app = express()
const port = 5000
const path = require("path")
const mongoose = require('mongoose')

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs") 
app.use(express.urlencoded({ extended: true }))
app.use("/css",express.static(path.join(__dirname, "css")))
app.use("/js",express.static(path.join(__dirname, "js")))

main()
.then(()=>{
    console.log("connection successful")
})
.catch(err => console.log(err))

async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/test')
}

app.get("/", (req, res) => {
    res.render("home_page.ejs")
})

app.get("/take_attendance",(req,res)=>{
    res.render("take_attendance.ejs")
})

app.get("/live_attendance",(req,res)=>{
    res.render("live_attendance.ejs")
})

app.get("/suggestions",(req,res)=>{
    res.render("suggestions.ejs")
})

app.get("/daily_routine",(req,res)=>{
    res.render("daily_routine.ejs")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

// ---------------------

// This is the base64 string from your image capture logic (e.g., a button click)
const base64Image = '...'; 

fetch('http://127.0.0.1:5000/recognize', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image })
})
.then(response => response.json())
.then(data => {
    console.log('Recognition Result:', data.name);
    // data.name will be the recognized person's name or "Unknown"
})
.catch(error => {
    console.error('Error:', error);
});

app.get("/face_recognition",(req,res)=>{
    res.render("face_recognition.ejs")
})

app.post("/recognize", (req, res) => {
    // Example: just sending a fake JSON response for now
    res.json({ name: "Test User" });
});
