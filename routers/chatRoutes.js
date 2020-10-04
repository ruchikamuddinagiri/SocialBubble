const express = require('express')
const path = require('path')
const router = new express.Router()
const {getAllRooms} = require('../utils/users')

router.get('/chat', (req, res)=>{
    let user = req.user
    if(!user){
        res.redirect('/')
    }
    res.render('joinGroup.ejs')
})
router.get('/chatroom', (req, res)=>{
    let user = req.user
    if(!user){
        res.redirect('/')
    }
    res.render('chat.ejs')
})
router.get('/chatbot', (req, res)=>{
    let user = req.user
    if(!user){
        res.redirect('/')
    }
    res.render('chatbot.ejs', {user:req.user})
})
router.get('/allRooms', (req, res)=>{
    const rooms = getAllRooms()
    res.status(200).send({
        rooms: rooms
    })
})

module.exports = router