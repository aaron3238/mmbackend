let cron = require('node-cron');
let nodemailer = require('nodemailer');
let moment = require('moment-timezone');

// kknwzzsrmdmnppaq
// e-mail message options
let mailOptions = {
      from: 'meetingmanagerku@gmail.com',
      to: 'aaron.pritchard321@gmail.com',
      subject: 'Email from Node-App: A Test Message!',
      text: 'Some content to send'
 };

// e-mail transport configuration
let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'meetingmanagerku@gmail.com',
        pass: 'kknwzzsrmdmnppaq'
      }
  });


  let newMeeting = { // example meeting
    meetingName: "Java Programming",
    meetingLink: "https://www.google.com",
    presenterName: "Dr. Carelli",
    startTime: "16:35",
    endTime: "20:00",
    daysOfWeek: {
      Monday: true, // 1 
      Tuesday: false, // 2
      Wednesday: true, // 3 
      Thursday: false, // 4 
      Friday: false, // 5 
      Saturday: false, // 6 
      Sunday: true // 7
  },
  minutesBeforeRemind: 0,
}


// function toTimeZone(time, zone) {

//   var format = 'HH:mm';
//   return moment(time, format).tz(zone).format(format);
// }

function getDaysOfWeekString(meeting){
  let resultString = "";
  for (const [key, value] of Object.entries(meeting.daysOfWeek)) {
    if(key=="Monday" && value){
      resultString+="1,"
    }
    if(key=="Tuesday" && value){
      resultString+="2,"
    }
    if(key=="Wednesday" && value){
      resultString+="3,"
    }
    if(key=="Thursday" && value){
      resultString+="4,"
    }
    if(key=="Friday" && value){
      resultString+="5,"
    }
    if(key=="Saturday" && value){
      resultString+="6,"
    }
    if(key=="Sunday" && value){
      resultString+="7,"
    }
  }

  return(resultString.slice(0, -1)); // remove trailing comma
}


function getCronString(meeting){
  let reminderTime = new Date; // get an inital date
  let hour = meeting.startTime.substr(0,2) // get hour from meeting
  let minute = meeting.startTime.substr(3,5) // get minute from meeting
  // set hours and minutes in reminder
  reminderTime.setHours(hour);
  reminderTime.setMinutes(minute);
  // subtract the minutes before remind
  const subtracted = moment(reminderTime).subtract(parseInt(meeting.minutesBeforeRemind), "minutes").toDate();
  // console.log(toTimeZone(reminderTime, "America/New_York"));
  let dowString = getDaysOfWeekString(meeting); // get comma separated days of week 
  // get string to pass to cron scheduler
  
  let returnString =  `0 ${subtracted.getMinutes()} ${subtracted.getHours()} * * ${getDaysOfWeekString(meeting)}`
  console.log(returnString);
  return returnString;
}

// The cron format consists of:
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
function sendMail(meeting){
  

  cron.schedule(getCronString(newMeeting), () => {
  // Send e-mail
  transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
  });
}


sendMail(newMeeting);