const mongoose = require('mongoose');
let notification = require('../models/notification')

const Schema = mongoose.Schema;

const dayToInt = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
}

const meetingSchema = new mongoose.Schema({
    meetingName: {type: String, required: true},
    meetingLink: {type: String, required: false},
    presenterName: {type: String, required: false},
    startTime: {type: String, required: true},
    endTime: {type: String, required: false},
    daysOfWeek: {type: Object, required: true},
    minutesBeforeRemind: {type: Number, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true }
} , {
    timestamps: true,
    collection: "meeting"
})

meetingSchema.post('save', function () {
    //Delete all notifications
    notification.find({meetingID: this._id})
    .then(notifs => {
        notifs.forEach(notif => {
            notification.findByIdAndDelete(notif._id)
            .then(console.log("deleted"))
        })
    })
    //Construct new notifications
    console.log(this.daysOfWeek);
    for (const [key, value] of Object.entries(this.daysOfWeek)) {
        if (value) {
            notif = new notification({
                meetingDay: dayToInt[key],
                meetingTime: this.startTime,
                offset: this.minutesBeforeRemind,
                lastFired: null,
                meetingID: this._id
            })

            notif.save();
        }
    }
})

meetingSchema.pre('findOneAndDelete', function () {
    //Delete all notifications
    console.log("Deleting notifications")
    notification.find({meetingID: this._id})
    .then(notifs => {
        notifs.forEach(notif => {
            notification.findByIdAndDelete(notif._id)
            .then(console.log("deleted"))
        })
    })
});

const meeting = mongoose.model("meeting", meetingSchema);

module.exports = meeting;