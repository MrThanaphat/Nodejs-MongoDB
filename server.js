const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const uuid = require('uuid').v4;
const router = require('./router/myRouter')
const server = express()

server.set('views',[path.join(__dirname,'views'),path.join(__dirname,'views/admin/')]) //อ้างอิงที่เก็บหน้า Webpage ที่อยู่ในโฟรเดอร์ Views
server.set('view engine','ejs') //ระบุ รูปแบบ engine เป็น ejs
server.use(express.urlencoded({extended:false})) //ส่งข้อมูลในรูปแบบ POST
server.use(cookieParser()) // เรียกใช้ cookie
server.use(session({
    genid: (req) => {
        return uuid() // สุ่มเลขสุ่มตัวอักษรเป็น session id
      },
    secret:"mySession",
    resave: false,
    saveUninitialized: false})) // เรียกใช้ session
server.use(router) // เรียกใช้ router
server.use(express.static(path.join(__dirname,'public'))) //ให้ server ทราบถึงไฟล์ รูปแบบ static ที่เก็บไว้ในโฟรเดอร์ public

server.listen(8080,()=>{
    console.log('Successfully started the server.')
})