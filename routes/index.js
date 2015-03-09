var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Define variables */
var mongoose = require('mongoose');
var Person = mongoose.model('Person');


/* PARAM, Pre-load a person object */  // this is called before any other contestant route handler
router.param('person', function(req, res, next, id){
	var query = Person.findById(id);
	
	query.exec(function(err, person){
		if(err){ return next(err); }
		if(!person){ return next(new Error("can't find person")); }
		
		req.person = person;
		//console.log("PRELOADED PERSON");
		return next();
	});
});

/* GET, get all persons */ // this is called a request handler
router.get('/persons', function(req, res, next) {
	Person.find(function(err, contestants) {
		if(err) {	return next(err); }
		
		res.json(contestants);
	});
});

/* POST, add a new person */
router.post('/persons', function(req, res, next){
	var person = new Person(req.body);
	
	person.save(function(person) {
		//if(err){ return next(err); }
		
		res.json(person);
	});
});

/* PARAM, Pre-load a contestant object */  // this is called before any other contestant route handler
/*router.param('contestant', function(req, res, next, id){
	var query = Contestant.findById(id);
	
	query.exec(function(err, contestant){
		if(err){ return next(err); }
		if(!contestant){ return next(new Error("can't find contestant")); }
		
		req.contestant = contestant;
		//console.log("PRELOADED CONTESTANT");
		return next();
	});
});

/* GET, get a single contestant */
/*router.get('/contestants/:contestant', function(req, res){
	req.contestant.populate('comments', function(err, contestant){
		res.json(contestant);	
	});
});

/* POST, delete a contestant */
/*router.post('/contestants/:contestant/remove', function(req, res, next) {
	req.contestant.remove(function(err, contestant){
		if(err) { return next(err); }
		
		res.json(contestant);
	});
});

/* PUT, upvote a contestant */
/*router.put('/contestants/:contestant/upvote', function(req, res, next) {
	req.contestant.upvote(function(err, contestant){
		if(err) { return next(err); }
		
		res.json(contestant);
	});
});

/* POST, add a new event */
/*router.post('/contestants/:contestant/events', function(req, res, next){
	var event = new Event(req.body);
	event.contestant = req.contestant;
	console.log(event); 
	
	event.save(function(err, contestant){
	if(err){ return next(err); }
		req.contestant.events.push(event);
		
		req.contestant.save(function(err, contestant){
		if(err){ return next(err); }
		
			res.json(event);
		});
	});
});



/* PARAM, Pre-load an event object */
/*router.param('event', function(req, res, next, id){
	var query = Event.findById(id);
	
	query.exec(function(err, event){
		if(err){ return next(err); }
		if(!event){ return next(new Error("can't find event")); }
		
		req.event = event;
		return next();
	});
});

/* GET, get all events */
/*router.get('/events', function(req, res, next) {
	Event.find(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* GET, get a single event */
/*router.get('/events/:event', function(req, res){
	res.json(req.event);	
});

/* PARAM, pre-load category */
/*router.param('category', function(req, res, next, newCategory){
	req.category = newCategory;
	return next();
});

/* GET, get all events that belong to Men's Golden Age */
/*router.get('/category/:category', function(req, res, next) {

	Event.find( {category: req.category} , function(err, events){
		if(err) {
			return next(err); 
		}
		res.json(events);
	});
});

/* POST, remove an event */
/*router.post('/events/:event/remove', function(req, res, next) {
	req.event.remove(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* PUT, score event given a round */
/*router.put('/events/:event/:option/:score', function(req, res, next) {
	req.event.score(req.round, req.score, function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

router.param('option', function(req, res, next, optionNumber){

	if(optionNumber == '1' ||
		optionNumber == '2' ||
		optionNumber == '3' ||
		optionNumber == '4' ||
		optionNumber == '5' ||
		optionNumber == '6' ||
		optionNumber == '7' ||
		optionNumber == '8' )
		{
			req.round = optionNumber;
			return next();
		}
	else {
		return next(new Error('The round number is not valid, it needs to be a number 1-4'));
	}
});

router.param('score', function(req, res, next, points){
	if(isNaN(points)){
		return next(new Error('The score is not valid, it needs to be a number'));
	}
	else {
		req.score = points;
		return next();
	}
});


/* PUT, add no points to an event */
/*router.put('/events/:event/score0', function(req, res, next) {
	req.event.scoreZero(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* PUT, add 1 point to an event */
/*router.put('/events/:event/score1', function(req, res, next) {
	req.event.scoreOne(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* PUT, add 1 point to an event */
/*router.put('/events/:event/score1', function(req, res, next) {
	req.event.scoreOne(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* PUT, add 2 points to an event */
/*router.put('/events/:event/score2', function(req, res, next) {
	req.event.scoreTwo(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* PUT, add 3 points to an event */
/*router.put('/events/:event/score3', function(req, res, next) {
	req.event.scoreThree(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});

/* PUT, subtract 1 point to an event */
/*router.put('/events/:event/deduct', function(req, res, next) {
	req.event.deductPoint(function(err, event){
		if(err) { return next(err); }
		
		res.json(event);
	});
});





/* PARAM, Pre-load a comment object */
/*router.param('comment', function(req, res, next, id){
	var query = Comment.findById(id);
	
	query.exec(function(err, comment){
		if(err){ return next(err); }
		if(!comment){ return next(new Error("can't find comment")); }
		
		req.comment = comment;
		//console.log("PRELOADED COMMENT");
		return next();
	});
});

/* POST, add a new comment */
/*router.post('/contestants/:contestant/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.contestant = req.contestant;
	
	comment.save(function(err, comment){
		if(err){ return next(err); }
		
		req.contestant.comments.push(comment);
		req.contestant.save(function(err, contestant){
			if(err){ return next(err); }
			
			res.json(comment);
		});
	});
});

/* PUT, upvote a comment */
/*router.put('/contestants/:contestant/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment){
		if(err) { return next(err); }
		
		res.json(comment);
	});
});


*/
module.exports = router;













