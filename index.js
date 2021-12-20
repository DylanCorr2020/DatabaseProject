var express = require('express')
var mySQLDAO = require('./MySQLDAO');
var MongoDAO = require('./MongoDAO');
var bodyParser = require('body-parser')
const { body,check, validationResult } = require('express-validator');


const { application } = require('express');
var mysql = require('promise-mysql');


var pool


mysql.createPool({
  connectionLimit : 3,
  host            : 'localhost',
  user            :  'root',
  password        :   '',
  database        : 'collegedb'
})
.then((result)=>{
pool = result
})
.catch((error)=>{
console.log(error)
});




//all functionality in express
var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine','ejs')


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/view/home.html");
})


app.get('/listmodules', function (req, res) {
  mySQLDAO.getModules()
  .then((result) => {
    res.render('showModules',{modules:result})
  })
  .catch((error) => {
    res.send(error)
  })
  
})


app.get('/module/edit/:mid',(req,res)=>{
  mySQLDAO.getOneModule(req.params.mid)
  .then((result)=>{
      console.log(result);
      res.render('editModule',{modules:result})
  })
  .catch((error)=>{
    res.send(error)
  })
})



app.get('/liststudents', function (req, res) {
   mySQLDAO.getStudents()
  .then((result) => {
    res.render('showStudents',{students:result})
  })
  .catch((error) => {
    res.send(error)
  })
  
})


app.get('/addStudent',(req,res)=>{
  res.render('addStudent',{errors:undefined})
})

app.post("/addStudent", 
[
  check('sid').isLength(4).withMessage("Student ID must be four characters"),
  check('name').isLength({min:5}).withMessage("Name must be atleast 5 characters"),
  check('gpa').isFloat({min:0.0,max:4.0}).withMessage("Gpa must be between 0.0 and 4.0")
],
(req, res) => {
var errors = validationResult(req);
if(!errors.isEmpty()){
  res.render("addStudent",{errors:errors.errors});
}
else
{
var myQuery = {
sql: 'INSERT INTO student VALUES (?, ?, ?)',
values: [req.body.sid, req.body.name , req.body.gpa]
}
pool.query(myQuery)
.then((data) => {
console.log(data)
res.redirect("/liststudents")
})
.catch(error => {
console.log(error)
})
}
})


app.post('/module/edit/:mid',(req,res)=>{

mySQLDAO.updateModule(req.body.name,req.body.credits,req.body.mid)
 .then((result)=>{
      console.log(result);
      res.redirect('/listmodules')
  })
  .catch((error)=>{
    res.send(error)
  })

})



app.get('/student/delete/:sid',(req,res) => {
  mySQLDAO.deleteStudent(req.params.sid)
  .then((result) => {
    if(result.affectedRows == 0){
            res.send("<h3>Doesnt Exist</h3>" + req.params.sid);
        }
    else
    {
        res.send("<h3> Student </h3>" + req.params.sid + "<h3>Deleted</h3>");
    }
  })
  .catch((error)=>{
   
    res.send(error)
       
  })
})


app.get('/module/students/:mid',(req,res)=>{

    mySQLDAO.getStudentModule(req.params.mid)
  .then((result) => {
    res.render('StudentModule',{studentModules:result})
  })
  .catch((error) => {
    res.send(error)
  })

})


 
       
app.get('/listLecturers',(req,res)=>{

  MongoDAO.getLecturers()
  .then((documents) => {
      res.render('ListLecturers',{lecturers:documents})
  })
  .catch((error)=>{
      res.send(error)
  })
  
})   

app.get('/add/Lecture',(req,res)=>{

  res.render('addLecture');

})

app.post('/add/Lecture',(req,res)=>{
  MongoDAO.addLecture(req.body._id,req.body.name,req.body.dept)
  .then((result)=>{
    res.redirect('/listLecturers');
  })
  .catch((error)=>{
    console.log(error)
    res.send("not okay")
  })

})





app.get('/module/edit',function(req,res){
  res.render('editModule');
})









app.listen(3001);