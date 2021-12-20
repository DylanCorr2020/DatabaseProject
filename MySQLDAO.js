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


var getModules = function(){
return new Promise((resolve,reject) => {
pool.query('select * from module')
  .then((result)=>{
    resolve(result)
  })
  .catch((error)=>{
    reject(error)
  })
  })
}


var getStudents = function(){
    return new Promise((resolve,reject) => {
        pool.query('select * from student')
         .then((result)=>{
    resolve(result)
     })
  .catch((error)=>{
    reject(error)
  })
  })

}

var getOneModule = function(mid){
    return new Promise((resolve,reject) => {
        var myQuary = {
            sql: 'select * from module where mid = ?',
            values: [mid]
        }
        pool.query(myQuary)
         .then((result) => {
          resolve(result)
         })
        .catch((error)=>{
           reject(error)
        })
    })
}

var updateModule = function(mid,name,credits){
   return new Promise((resolve,reject) => {
        var myQuary = {
            sql: 'UPDATE module set name = ? , credits = ? where mid = ?',
            values: [name,credits,mid]
        }
        pool.query(myQuary)
         .then((result) => {
          resolve(result)
         })
        .catch((error)=>{
           reject(error)
        })
    })

}


var getStudentModule = function(mid){
 return new Promise((resolve,reject) => {
     var myQuary = {
       sql: ' select s.sid,s.name,s.gpa from student_module sm inner join student s on s.sid = sm.sid inner join module m on m.mid = sm.mid where m.mid = ?',
       values: [mid]
     }
  
     pool.query(myQuary)
         .then((result) => {
          resolve(result)
         })
        .catch((error)=>{
           reject(error)
        })
      })
}

var deleteStudent = function(sid){
    return new Promise((resolve,reject) => {
        var myQuary = {
            sql: 'delete from student where sid = ?',
            values: [sid]
        }
        pool.query(myQuary)
         .then((result) => {
          resolve(result)
         })
        .catch((error)=>{
           reject(error)
        })
    })
}


module.exports = {getModules,getStudents,deleteStudent,getOneModule,getStudentModule,updateModule}
