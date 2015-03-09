var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
	last_name: String,
	first_name: String,
	email: String//,
	//classes: [{type: String}],
	//translation: [{type: String}]
});

mongoose.model('Person', PersonSchema);