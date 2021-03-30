const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    meetingDay: {type: Number, required: true},
    meetingTime: {type: String, required: true},
    offset: {type: Number, required: true},
    meetingID: {type: Schema.Types.ObjectId, ref: 'meetingID', required: true },
    lastFired: {type: Date, required: false}

}, {
    timestamps: true,
    collection: "notification"
})

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;