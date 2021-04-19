const router = require('express').Router();



router.route('/').get((req, res)=>{
    res.json('status: 200');
});



module.exports=router;