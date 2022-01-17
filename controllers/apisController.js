const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Salle = mongoose.model('Salle');
const Bloc = mongoose.model('Bloc');
router.get('/',function(req,res,next){
    Bloc.find((err, docs) => {
        Salle.find({}).then(function(salle){
            res.send(salle);
        }).catch(next);
    });

});

router.post('/',function(req,res,next){
    Salle.create(req.body).then(function(salle){
        res.send(salle);
    }).catch(next);
});


router.put('/:id',function(req,res,next){
    Salle.findOneAndUpdate({_id: req.params.id},req.body).then(function(salle){
        Salle.findOne({_id: req.params.id}).then(function(salle){
            res.send(salle);
        });
    });
});


router.delete('/:id',function(req,res,next){
    Salle.findOneAndDelete({_id: req.params.id}).then(function(salle){
        res.send(salle);
    });
});
module.exports = router;