const express = require('express')
const app = express()
const port = 8080
const path = require("path")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs") 
app.use(express.urlencoded({ extended: true }))
app.use('/image', express.static('image'));
app.use("/css",express.static(path.join(__dirname, "css")))
// <<<<<<< HEAD
app.use("/js",express.static(path.join(__dirname, "js")))
app.use('/image', express.static('image'));
// =======

// >>>>>>> b638f10891e7d71632a303eea1838439c3b1d025
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

app.get("/suggestions/survey",(req,res)=>{
    res.render("suggestions_tasks.ejs")
})

app.get("/suggestions/survey/submitted",(req,res)=>{
    res.render("counsellor.ejs")
})

app.get("/counsellor",(req,res)=>{
    res.render("counsellor_student.ejs")
})

app.get("/qr",(req,res)=>{
    res.render("qr_code.ejs")
})


app.get("/daily_routine",(req,res)=>{
    res.render("daily_routine.ejs")
})

app.get("/time_table",(req,res)=>{
    res.render("time_table.ejs")
})

app.get("/display",(req,res)=>{
    res.render("display.ejs")
})

app.get("/tasks",(req,res)=>{
    res.render("tasks.ejs")
})


app.get("/face_recognition",(req,res)=>{
    res.render("face_recognition.ejs")
})

app.get("/face_recognition/recognition_successful", (req, res) => {
    res.render("recognition_successful.ejs");
});

app.get("/fake", (req, res) => {
    res.render("home_page_2.ejs");
});



app.get("/table_created", (req, res) => {
    res.render("time_table_submitted.ejs");
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})