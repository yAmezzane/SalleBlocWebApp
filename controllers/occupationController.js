const express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Occupation = mongoose.model('Occupation');
const Salle = mongoose.model('Salle');
const Crenau = mongoose.model('Crenau');

router.get('/api', function (req, res, next) {
    Crenau.find((err, docs) => {
        Salle.find((err, docs) => {
            Occupation.find({}).then(function (occupation) {
                res.send(occupation);
            }).catch(next);
        });

    });
});

router.post('/apic', function (req, res, next) {
    Occupation.create(req.body).then(function(occupation){
        res.send(occupation);
    }).catch(next);
    
});

router.get('/', (req, res) => {
    Crenau.find((err, docss) => {
        Salle.find((err, docs) => {
            if (!err) {
                console.log(docs);
                console.log(docss);
                res.render("occupation/addOrEdit", {
                    salles: docs,
                    crenaus: docss,
                    viewTitle: "Insert Occupation"
                });
            }
            else {
                console.log('Error in retrieving salles list :' + err);
            }
        });
    });

});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});
function dateCompare(time1, time2) {
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0], parts[1], "00", 0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0], parts[1], "00", 0);

    // returns 1 if greater, -1 if less and 0 if the same
    if (t1.getTime() > t2.getTime()) return 1;
    if (t1.getTime() < t2.getTime()) return -1;
    return 0;
}

function insertRecord(req, res) {

    var occupation = new Occupation();
    var d = true;
    var e = false;
    var f = false;

    occupation.date = req.body.date;

    console.log(req.body.crenau + "fggh");
    Crenau.findById(req.body.crenau, function (err, docss) {
        Salle.findById(req.body.salle, function (err, docs) {
            if (err) {
                console.log(err);
            }
            else {
                occupation.namesalle = docs.name
                occupation.crenauhr = docss.hrdebut + " to " + docss.hrfin

                occupation.salle = docs;
                occupation.crenau = docss;

                console.log(occupation + "dedede")

                Occupation.find((err, docsss) => {

                    for (i = 0; i < docsss.length; i++) {
                        item = docsss[i];
                        console.log(item.namesalle);
                        console.log(occupation.namesalle);
                        if (item.namesalle == occupation.namesalle) {
                            d = false
                            break;
                        }
                        else {
                            d = true;
                        }
                    }
                    if (d == false) {
                        for (j = 0; j < docsss.length; j++) {
                            item = docsss[j];
                            if (item.namesalle == occupation.namesalle) {
                                if (item.date == occupation.date) {
                                    e = false;
                                    break;
                                }
                                else {
                                    e = true;
                                }
                            }
                        }
                    }
                    if (d == false & e == false) {
                        for (k = 0; k < docsss.length; k++) {

                            item = docsss[k];
                            if (item.namesalle == occupation.namesalle) {

                                if (item.date == occupation.date) {

                                    console.log(item.crenau);
                                    console.log(req.body.crenau);

                                    if (item.crenau == req.body.crenau) {

                                        f = false
                                        break;
                                    }
                                    else {
                                        f = true
                                    }
                                }
                            }
                        }
                    }
                    console.log("d" + d);
                    console.log("e" + e);
                    console.log("f" + f);

                    if (d == true || e == true || f == true) {
                        occupation.save((err, doc) => {
                            if (!err)
                                res.redirect('occupation/list');
                            else {
                                if (err.name == 'ValidationError') {
                                    handleValidationError(err, req.body);
                                    res.render("occupation/addOrEdit", {
                                        viewTitle: "Insert Occupation",
                                        occupation: req.body
                                    });
                                }
                                else
                                    console.log('Error during record insertion : ' + err);
                            }
                        });
                    }
                });
                console.log("occupation : ", docs);
            }
        });
    });


    console.log("Salle.findById(req.body.hall)");

    occupation.salle = Salle.findById(req.body.hall);
    occupation.crenau = Crenau.findById(req.body.hall);
}

function updateRecord(req, res) {
    Occupation.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('occupation/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("occupation/addOrEdit", {
                    viewTitle: 'Update Occupation',
                    occupation: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Occupation.find((err, docs) => {
        if (!err) {
            res.render("occupation/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Occupation list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'date':
                body['dateError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Occupation.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("occupation/addOrEdit", {
                viewTitle: "Update Occupation",
                occupation: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Occupation.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/occupation/list');
        }
        else { console.log('Error in occupation delete :' + err); }
    });
});


router.put('/api/:id', function (req, res, next) {
    Occupation.findOneAndUpdate({ _id: req.params.id }, req.body).then(function (occupation) {
        Occupation.findOne({ _id: req.params.id }).then(function (occupation) {
            res.send(occupation);
        });
    });
});


router.delete('/api/:id', function (req, res, next) {
    Occupation.findOneAndDelete({ _id: req.params.id }).then(function (occupation) {
        res.send(occupation);
    });
});

module.exports = router;