const express = require('express')
const app = express()
const port = 8080
const path = require("path")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs") 
app.use(express.urlencoded({ extended: true }))
app.use("/css",express.static(path.join(__dirname, "css")))
app.use("/js",express.static(path.join(__dirname, "js")))

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

app.get("/face_recognition",(req,res)=>{
    res.render("face_recognition.ejs")
})

app.get("/face_recognition/recognition_successful", (req, res) => {
    res.render("recognition_successful.ejs");
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})