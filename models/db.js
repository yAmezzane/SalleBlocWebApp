const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://youssef:youssef@clusteryoussef.np12k.mongodb.net/SchoolDB?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./bloc.model');
require('./salle.model');
require('./crenau.model');
require('./occupation.model');
