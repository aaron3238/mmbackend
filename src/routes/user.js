const router = require('express').Router();
const mongoose = require('mongoose');
let user = require('../models/user');
let meeting = require('../models/meeting');

// get all users
router.route('/').get((req, res) => {
    user.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error getting all users " + err))
})

// find a user
router.route('/:id').get((req, res)=>{
    user.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json("Error finding user: " + err))
})

// find by username and pass
router.route('/login').post((req, res)=>{
    console.log("email: " + req.body.email + " Password: " + req.body.password)
    user.findOne({"email": req.body.email, "password": req.body.password})
    .then(user => res.json(user._id))
    .catch(err => res.status(400).json("No user found for: " + req.body.email + " " + err))
})

// edit user
router.route('/:id').post((req, res)=>{
    user.findById(req.params.id)
    .then(updateUser => {
        updateUser.name = req.body.name,
        updateUser.email = req.body.email,
        updateUser.password = req.body.password

        updateUser.save()
        .then(updatedUser => res.json(updatedUser))
        .catch(err => res.status(400).json("Error saving the user: " + err));
    })
    .catch(err => res.status(400).json("Error finding user: " + err));
});

// make a new user
router.route('/').post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new user({
        name,
        email,
        password,
    })

    newUser.save()
    .then(newUser => res.json(newUser))
    .catch(err => res.status(400).json("You messed up! " + err));
})


// delete a user and all their meetings
router.route('/:id').delete((req, res) => {
    user.findByIdAndDelete(req.params.id)
    .then(deletedUser => {
        meeting.deleteMany({"user": deletedUser.id})
        .then(result => res.json({removed: true}))
        .catch(err => res.status(400).json("Error deleting meetings: " + err))
    })
    .catch(err => res.status(400).json("Error deleting user: " + err))
})
module.exports=router;