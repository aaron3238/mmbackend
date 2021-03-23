const mongoose = require('mongoose');

const Schema = mongoose.Schema;


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

const meeting = mongoose.model("meeting", meetingSchema);

module.exports = meeting;