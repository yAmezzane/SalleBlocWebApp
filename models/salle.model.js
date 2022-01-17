const { Schema } = require('mongoose');
const mongoose = require('mongoose');

var salleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    capacite: {
        type: Number
    },
    bloc: {
        type: Schema.Types.ObjectId, ref:'Bloc'

    },
    blocName: {
        type: Schema.Types.String, ref:'Bloc'

    },

});
/*
// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');*/

mongoose.model('Salle', salleSchema);