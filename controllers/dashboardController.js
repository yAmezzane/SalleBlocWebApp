const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  
            res.render("dashboard/dash", {


            });
});

router.post('/', (req, res) => {
    res.render("dashboard/dash", {
    
    });
    
});

module.exports = router;