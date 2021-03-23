const router = require('express').Router();



router.route('/').get((req, res)=>{
    res.json('test: imanhttpserver');
});



module.exports=router;