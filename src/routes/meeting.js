const router = require('express').Router();
const mongoose = require('mongoose');
let meeting = require('../models/meeting');
let user = require('../models/user');

// get all meetings 
router.route('/').get((req, res) => {
    meeting.find()
    .then(meetings => res.json(meetings))
    .catch(err => res.status(400).json("Error getting all meetings" + err));
});

// get a meeting
router.route('/:id').get((req, res) => {
    meeting.findById(req.params.id)
    .then(meeting => res.json(meeting))
    .catch(err => res.status(400).json("Error finding meeting: " + err))
})
// get meetings for a user
router.route('/byuser/:id').get((req, res) => { 
    meeting.find({"user": req.params.id})
    .then(meetings => res.json(meetings))
    .catch(err => res.status(400).json("Error finding meetings for user: " + req.params.id + err))
})

// edit a meeting 
router.route('/:id').post((req, res) => {
    meeting.findById(req.params.id)
    .then(updateMeeting => {
        console.log(updateMeeting)
        updateMeeting.meetingName = req.body.meetingName,
        updateMeeting.meetingLink = req.body.meetingLink,
        updateMeeting.presenterName = req.body.presenterName,
        updateMeeting.startTime = req.body.startTime,
        updateMeeting.endTime = req.body.endTime,
        updateMeeting.daysOfWeek = req.body.daysOfWeek,
        updateMeeting.minutesBeforeRemind = req.body.minutesBeforeRemind,
        updateMeeting.user = req.body.user
        console.log(updateMeeting)

        updateMeeting.save()
        .then(updateMeeting => res.json(updateMeeting))
        .catch(err => res.status(400).json("Error saving the meeting: " + err));
    })
    .catch(err => res.status(400).json("Error finding the meeting: ", err))
})
// delete a meeting 
router.route('/:id').delete((req, res) => {
    meeting.findByIdAndDelete(req.params.id)
    .then(deletedMeeting => res.json("deleted!"))
    .catch(err => res.status(400).json("Error deleting meeting: " + deletedMeeting.meetingName + err))
})


// create new meeting
router.route('/').post((req, res)=>{
    const meetingName = req.body.meetingName;
    const meetingLink = req.body.meetingLink;
    const presenterName = req.body.presenterName;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const daysOfWeek = req.body.daysOfWeek;
    const minutesBeforeRemind = req.body.minutesBeforeRemind;
    const user = req.body.user;

    const newMeeting = new meeting({
        meetingName,
        meetingLink,
        presenterName,
        startTime,
        endTime,
        daysOfWeek,
        minutesBeforeRemind,
        user
    });

    newMeeting.save()
    .then(newMeeting => res.json(newMeeting))
    .catch(err => res.status(400).json("You messed up! " + err));

})

module.exports=router;