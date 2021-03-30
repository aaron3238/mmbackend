var node = require('node-schedule');
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

var sendEmail = node.scheduleJob('0 6 * * *', function(){
   console.log('Starting..');
   init(); // write your logic here to send email
});

function init() {
  console.log('Your logic goes here.');
  
}

module.exports = {
    cronService: cronService
}