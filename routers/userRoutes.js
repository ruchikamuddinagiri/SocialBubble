const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy;

const router = new express.Router()

const User = require('../database/models/userModel')
const formParser = require('../middleware/formParser')
const auth = require('../middleware/auth')

//get routes
//signup route
router.get('/', (req, res)=>{
    res.render('signup.ejs')
})
//login route
router.get('/login', (req, res)=>{
    let cookie = req.cookies['connect.sid']
    if(!cookie){
        res.redirect('/')
    }
    res.render('login.ejs')
})
router.get('/bye', (req, res)=>{
    res.render('logout.ejs')
})
//logout route
router.get('/logout', (req, res)=>{
    req.session.destroy((err) => {
        req.logout()
        cookie = req.cookies;
        for (var prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }    
            res.cookie(prop, '', {expires: new Date(0)});
        }
        res.redirect('/bye') // will always fire after session is destroyed
      })
    // delete req.session;
    // res.redirect()
})
//home route
router.get('/home', auth, (req, res)=>{
    let user = req.user
    if(!user){
        res.redirect('/')
    }
    console.log("user",req.user)
    console.log(req.cookies['connect.sid'])
    res.render('home.ejs', {
        user: req.user
    })
})
//get profile
router.get('/profile', auth, (req, res)=>{
    let user = req.user
    if(!user){
        res.redirect('/')
    }
    res.render('profile.ejs', {
        user: req.user
    })
})
//get groups
router.get('/groups', auth, (req, res)=>{
    let user = req.user
    if(!user){
        res.redirect('/')
    }
    res.render('groups.ejs', {
        user: req.user
    })
})

//post routes
//signup formController,
router.post('/signup', formParser, async (req, res) => {
    const user = new User({name:req.body.name, email: req.body.email, password: req.body.password})
    try{
        await user.save()
        res.status(200).redirect('/login')
    } catch(e){
        res.status(400).redirect('/')
    }
})

// const validPassword = async (passwordnew, passwordold) => {
//     console.log(passwordnew, passwordold)
//     const match = await bcrypt.compare(passwordnew, passwordold)
//     console.log(match)
//     return match
// }
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    // passReqToCallback: true,
  },
    function(username, password, done) {
      User.findOne({ email: username }, async function (err, user) {
        if (err) { 
            return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        //const valid = validPassword(password, user.password)
        const valid = await bcrypt.compare(password, user.password)
        console.log("valid", valid)
        if (!valid) {
            console.log("i'm in here")
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
// //successRedirect:'/home',
router.post('/login', [formParser, passport.authenticate('local', {session: true, failureRedirect: '/login'})], (req, res) => {
    console.log('You are logged in!');
    req.session.user = req.user
    console.log(req.session.user)
    res.redirect('/home')
});

module.exports = router