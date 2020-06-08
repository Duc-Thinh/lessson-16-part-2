var express = require("express");
var db = require("./db.js");
var bcrypt = require('bcrypt');
var saltRounds = 10;
var connect = {
  lists: db.get("userList").value(),
  list: db.get("listBook").value()
};
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser())

module.exports.login = (req,res)=>{
  res.render('login.pug')    
}

var i = 2
module.exports.postLogin =  (req,res)=>{
  var email = req.body.email
  var password = req.body.password
  var user = db.get('userList').find({email: email}).value()
  if(!user){
    res.render('login.pug',{errors: ['User does not exist'],values: req.body})
  return
  }
  bcrypt.compare(password,user.password, function(err, result) {
    if(!result){   
      if(req.cookies.wrongLoginCount > 4){
        res.render('login.pug',{errors: ['wrong password too much'],values: req.body})  
        return
      }
      res.cookie('wrongLoginCount', i++)
      res.render('login.pug',{errors: ['wrong password'],values: req.body}) 
      return
    }else{
      res.cookie('userId', user.id) 
      i = 2
      res.clearCookie('wrongLoginCount');
      if(user.isAdmin === true){
        res.redirect('/admin') 
      }else{
        res.redirect('/main')  
      }
    }
  });
}