const mongoose = require('mongoose');

var blocSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    libelle: {
        type: String
    },

});

mongoose.model('Bloc', blocSchema);