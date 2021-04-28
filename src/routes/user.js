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
    user.findOne({ email : req.body.email }, function(err, user) {
        if (user === null) {
            return res.status(400).send({
                message : "User not found."
            });
        }
        else {
            if (user.validPassword(req.body.password)) {
                return res.json(user._id)
            }
            else {
                return res.status(400).json("No user found for: " + req.body.email + " " + err)
            }
        }
    })
    //.catch(err => res.status(400).json("No user found for: " + req.body.email + " " + err))
})

router.route('/email').post((req, res)=>{
    console.log("email: " + req.body.email + " Password: " + req.body.password)
    user.findOne({"email": req.body.email})
    .then(user => res.json(user._id))
    .catch(user => res.json(user.email))
})






// edit user
router.route('/:id').post((req, res)=>{
    user.findById(req.params.id)
    .then(updateUser => {
        updateUser.name = req.body.name,
        updateUser.email = req.body.email,
        updateUser.password = (user => user.setPassword(req.body.password))

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
    console.log("email: " + req.body.email + " Password: " + req.body.password)

    const newUser = new user({
        name,
        email,
       
    })
    newUser.setPassword(password)

    newUser.save()
    .then(newUser => res.json(newUser._id))
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