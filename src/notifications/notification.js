const mongoose = require('mongoose');
let cron = require('node-cron');
let nodemailer = require('nodemailer');
let moment = require('moment-timezone');


let meeting = require('../models/meeting');
let notification = require('../models/notification')
let user = require('../models/user');

require('dotenv').config();

const auth = {
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
}

function handleNotifications() {
    console.log("Checking notifications")
    notification.find()
    .then(notifs => { notifs.forEach(notification => validateNotifications(notification)) });
}

function stringToTime(timeString) {
    let timestamp = new Date; // get an inital date
    let hour = timeString.substr(0,2) // get hour from meeting
    let minute = timeString.substr(3,5) // get minute from meeting
    // set hours and minutes in reminder
    timestamp.setHours(hour);
    timestamp.setMinutes(minute);
    return timestamp
}
/**
 * 
 * @param {*} notif An individual notification
 */
function validateNotifications(notif) { 
    const today = new Date();
    const notifTime = stringToTime(notif.meetingTime);
    const subtracted = moment(notifTime).subtract(parseInt(notif.offset), "minutes").toDate();
    const placeholder = new Date(Date.now());
    const day = placeholder.getDay()
    if (notif.meetingDay == day){
        console.log("-----------------");
        console.log('%o and (%o or %o)', (today < subtracted), (notif.lastFired != null), (notif.lastFired < subtracted));
        // https://www.howtocreate.co.uk/xor.html

        console.log("today:      " + today.getTime());
        console.log("subtracted: " + subtracted.getTime()); 
        
        if (today > subtracted){
            console.log("Within notification time")
            if ( (notif.lastFired == null) || (subtracted > notif.lastFired) ){
                console.log("Notifying")
                getMailData(notif.meetingID)
                notif.lastFired = Date.now();
                console.log(notif.lastFired)
                notif.save()
                .then(() => console.log("Notified"));
            } else {
                console.log("Already Notified")
            }
        } else {
            console.log("Out of Notification range.")
        }
    }
}

function getMailData(meetingID) {
    meeting.findById(meetingID)
    .then(m => {
        user.findById(m.user)
        .then(u => {
            return constructMail(m, u)
        })
    })
}

/**
 * @param m meeting
 * @param u user
 */
function constructMail(m, u) {
    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: u.email,
        subject: "Don't Forget",
        text: 'You have ' + m.meetingName + ' today at, ' + m.startTime + '.'
    };
    sendEmail(mailOptions);
    return mailOptions
}

function sendEmail(mailOptions) {
    let transport = nodemailer.createTransport(auth);
    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
}

module.exports = {handleNotifications}