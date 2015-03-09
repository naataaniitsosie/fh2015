angular.module('powwow', ['ui.router'])

.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('admin', {
			url: '/admin/numbers',
			templateUrl: '/admin/numbers.html',
			controller: 'ParCtrl',
			resolve: {
				contestantsPromise: ['contestants', function(contestants){
					return contestants.getAll();
				}]
			}
		})
		.state('contestants', {
			url: '/contestants/{id}',
			templateUrl: '/contestants.html',
			controller: 'ContestantsCtrl',
			resolve: {
				//contestant: ['$stateParams', 'contestants', function($stateParams, contestants) {
					//return contestants.getContestantPromise($stateParams.id);
				//}]
			}
		})
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'RegCtrl',
			resolve: {
				//contestantsPromise: ['contestants', function(contestants){
					//return contestants.getAll();
				//}]
			}
		});

	$urlRouterProvider.otherwise('home');
}])

.factory('contestants', ['$http', function($http) { // this is where are front end and back end meet!
	var o = {
		contestants:  []
	};
	
	o.clear = function() {
		contestants = [];
	};
	
	o.getContestantPromise = function(id){
		return $http.get('/contestants/' + id).then(function(res){
			
			var newContestant = res.data;
			var newEvents = [];
			for(var i = 0; i < newContestant.events.length; i++) {
				o.getEvent(newContestant.events[i], newEvents);
			}
			
			return {contestant: newContestant, events: newEvents};
		});
	};
	
	o.getEvent = function(id, events) {
		return $http.get('/events/' + id).then(function(res){
			events.push(res.data);
		});
	};
	
	o.getContestantWithEvent = function(event1){
		return $http.get('/contestants/' + event1.contestant).then(function(res){
			o.contestants.push({contestant: res.data, event: event1});
		});
	};
	
	/* get All contestants without the events*/
	o.getAll = function() {
		return $http.get('/persons').success(function(data){
			angular.copy(data, o.contestants);
		});
	};
	
	o.getByCategory = function(category) {
		return $http.get('/category/' + category)
		.success(function(events){
			while(o.contestants.length > 0) {
				o.contestants.pop();
			}
			for(var i = 0; i < events.length; i++) {
				o.getContestantWithEvent(events[i]);
			}
			// sort contestants
		});
	};
	
	o.create = function(person, classes) {
		return $http.post('/persons', person)// tells server to add person
		.success(function(data){ // allows us to data bind					
			
			o.contestants.push(data); // tells controller to add person
		});
	};
	
	o.addEvent = function(event, contestant) {
		return $http.post('/contestants/' + contestant._id + '/events', event)
		.success(function(data){
			console.log("added: " + data.category +" to: " + contestant.last_name);
			contestant.events.push(data);
		});
		
	};
	
	o.remove = function(contestant) {
		return $http.post('/contestants/' + contestant._id + '/remove')
		.success(function(data){
			o.remove(data);
		});
	};
	
	o.removeEvent = function(eventId) {
		return $http.post('/events/' + eventId+ '/remove')
		.success(function(removedEvent){});
	};
	
	o.updateScore = function(contestant, option, score) {
		
		if(isNaN(score) || score == '') {
			return;
		}
		
		return $http.put('/events/' + contestant.event._id + '/' + option + '/' + score)
		.success(function(data){
			switch(option) {
				case '1':
					contestant.contestant.roundOneScore = data.roundOneScore;
					break;
				case '2':
					contestant.contestant.roundTwoScore = data.roundTwoScore;
					break;
				case '3':
					contestant.contestant.roundThreeScore = data.roundThreeScore;
					break;
				case '4':
					contestant.contestant.roundFourScore = data.roundFourScore;
					break;
				case '5':
					contestant.contestant.grandEntryOne = data.grandEntryOne;
					break;
				case '6':
					contestant.contestant.grandEntryTwo = data.grandEntryTwo;
					break;
				case '7':
					contestant.contestant.grandEntryThree = data.grandEntryThree;
					break;
				case '8':
					contestant.contestant.extraPoints = data.extraPoints;
					break;
				default:
					break;
			}
			contestant.event.totalPoints = data.totalPoints;
		});
	};
	
	o.upvote = function(contestant) {
		return $http.put('/contestants/' + contestant._id + '/upvote')
		.success(function(data){
			contestant.upvotes += 1;
		});
	};
	
	o.addComment = function(id, comment) {
		return $http.post('/contestants/' + id + '/comments', comment);
	};
	
	o.upvoteComment = function(contestant, comment){
		return $http.put('/contestants/' + contestant._id + '/comments/' + comment._id + '/upvote')
		.success(function(data){
			comment.upvotes += 1;
		});
	};
	
	return o;
}])

.controller('MainCtrl', [
'$scope',
'contestants',
function($scope, contestants){

	
	$scope.contestants = contestants.contestants; //this is for the home state
	
	$scope.incrementUpvotes = function(contestant) {
		contestants.upvote(contestant);
	};
}])

.controller('ParCtrl', [
'$scope',
'contestants',
function($scope, contestants){

	$scope.contestants = contestants.contestants;
		
	$scope.getContestantsInMensGoldenAge = function() {
		contestants.getByCategory('mens_golden_age');
		$scope.category = 'Men\'s Golden Age';
	};
	$scope.getContestantsInMensTraditional = function() {
		contestants.getByCategory('mens_traditional');
		$scope.category = 'Men\'s Traditional';
	};
	$scope.getContestantsInMensFancy = function() {
		contestants.getByCategory('mens_fancy');
		$scope.category = 'Men\'s Fancy';
	};
	$scope.getContestantsInMensGrass = function() {
		contestants.getByCategory('mens_grass');
		$scope.category = 'Men\'s Grass';
	};
	$scope.getContestantsInTeenBoysTraditional = function() {
		contestants.getByCategory('teen_boys_traditional');
		$scope.category = 'Teen Boys\' Traditional';
	};
	$scope.getContestantsInTeenBoysFancy = function() {
		contestants.getByCategory('teen_boys_fancy');
		$scope.category = 'Teen Boys\' Fancy';
	};
	$scope.getContestantsInTeenBoysGrass = function() {
		contestants.getByCategory('teen_boys_grass');
		$scope.category = 'Teen Boys\' Grass';
	};
	$scope.getContestantsInJuniorBoysTraditional = function() {
		contestants.getByCategory('junior_boys_traditional');
		$scope.category = 'Junior Boys\' Traditional';
	};
	$scope.getContestantsInJuniorBoysFancy = function() {
		contestants.getByCategory('junior_boys_fancy');
		$scope.category = 'Junior Boys\' Fancy';
	};
	$scope.getContestantsInJuniorBoysGrass = function() {
		contestants.getByCategory('junior_boys_grass');
		$scope.category = 'Junior Boys\' Grass';
	};
	$scope.getContestantsInWomensGoldenAge = function() {
		contestants.getByCategory('womens_golden_age');
		$scope.category = 'Women\'s Golden Age';
	};
	$scope.getContestantsInWomensTraditional = function() {
		contestants.getByCategory('womens_traditional');
		$scope.category = 'Women\'s Traditional';
	};
	$scope.getContestantsInWomensFancy = function() {
		contestants.getByCategory('womens_fancy');
		$scope.category = 'Women\'s Fancy';
	};
	$scope.getContestantsInWomensJingle = function() {
		contestants.getByCategory('womens_jingle');
		$scope.category = 'Women\'s Jingle';
	};
	$scope.getContestantsInTeenGirlsTraditional = function() {
		contestants.getByCategory('teen_girls_traditional');
		$scope.category = 'Teen Girl\'s Traditional';
	};
	$scope.getContestantsInTeenGirlsFancy = function() {
		contestants.getByCategory('teen_girls_fancy');
		$scope.category = 'Teen Girl\'s Fancy';
	};
	$scope.getContestantsInTeenGirlsJingle = function() {
		contestants.getByCategory('teen_girls_jingle');
		$scope.category = 'Teen Girl\'s Jingle';
	};
	$scope.getContestantsInJuniorGirlsTraditional = function() {
		contestants.getByCategory('junior_girls_traditional');
		$scope.category = 'Junior Girl\'s Traditional';
	};
	$scope.getContestantsInJuniorGirlsFancy = function() {
		contestants.getByCategory('junior_girls_fancy');
		$scope.category = 'Junior Girl\'s Fancy';
	};
	$scope.getContestantsInJuniorGirlsJingle = function() {
		contestants.getByCategory('junior_girls_jingle');
		$scope.category = 'Junior Girl\'s Jingle';
	};
	$scope.getContestantsInTinyTots = function() {
		contestants.getByCategory('tiny_tots');
		$scope.category = 'Tiny Tots';
	};
	
	$scope.incrementUpvotes = function(contestant) {
		contestants.upvote(contestant.contestant);
	};
	
	$scope.setPrevValue = function(value) {
		$scope.prevValue = value;
	};
	
	$scope.updateScore = function(contestant, option) {
		switch(option) {
			case 1:
				if(isNaN(contestant.event.roundOneScore) || contestant.event.roundOneScore == '') {
					contestant.event.roundOneScore = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.roundOneScore);
				}
				break;
			case 2:
				if(isNaN(contestant.event.roundTwoScore) || contestant.event.roundTwoScore == '') {
					contestant.event.roundTwoScore = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.roundTwoScore);
				}
				break;	
			case 3:
				if(isNaN(contestant.event.roundThreeScore) || contestant.event.roundThreeScore == '') {
					contestant.event.roundThreeScore = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.roundThreeScore);
				}
				break;
			case 4:
				if(isNaN(contestant.event.roundFourScore) || contestant.event.roundFourScore == '') {
					contestant.event.roundFourScore = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.roundFourScore);
				}
				break;
			case 5:
				if(isNaN(contestant.event.grandEntryOne) || contestant.event.grandEntryOne == '') {
					contestant.event.grandEntryOne = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.grandEntryOne);
				}
				break;	
			case 6:
				if(isNaN(contestant.event.grandEntryTwo) || contestant.event.grandEntryTwo == '') {
					contestant.event.grandEntryTwo = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.grandEntryTwo);
				}
				break;
			case 7:
				if(isNaN(contestant.event.grandEntryThree) || contestant.event.grandEntryThree == '') {
					contestant.event.grandEntryThree = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.grandEntryThree);
				}
				break;
			case 8:
				if(isNaN(contestant.event.extraPoints) || contestant.event.extraPoints == '') {
					contestant.event.extraPoints = $scope.prevValue;
				}
				else {
					contestants.updateScore(contestant, option, contestant.event.extraPoints);
				}
				break;
			default:
				break;
		}
	};
}])

.controller('RegCtrl', [
'$scope',
'contestants',
function($scope, contestants){

	$scope.contestants = contestants.contestants;
	
	$scope.registerContestant = function() {
		var classes = [];
		/*var events = [];
		if($scope.mens_golden_age === 'yes') {
			events.push('mens_golden_age');
		}
		if($scope.mens_traditional === 'yes') {
			events.push('mens_traditional');
		}
		if($scope.mens_fancy === 'yes') {
			events.push('mens_fancy');
		}
		if($scope.mens_grass === 'yes') {
			events.push('mens_grass');
		}
		if($scope.teen_boys_traditional === 'yes') {
			events.push('teen_boys_traditional');
		}
		if($scope.teen_boys_fancy === 'yes') {
			events.push('teen_boys_fancy');
		}
		if($scope.teen_boys_grass === 'yes') {
			events.push('teen_boys_grass');
		}
		if($scope.junior_boys_traditional === 'yes') {
			events.push('junior_boys_traditional');
		}
		if($scope.junior_boys_fancy === 'yes') {
			events.push('junior_boys_fancy');
		}
		if($scope.junior_boys_grass === 'yes') {
			events.push('junior_boys_grass');
		}
		if($scope.womens_golden_age === 'yes') {
			events.push('womens_golden_age');
		}
		if($scope.womens_traditional === 'yes') {
			events.push('womens_traditional');
		}
		if($scope.womens_fancy === 'yes') {
			events.push('womens_fancy');
		}
		if($scope.womens_jingle === 'yes') {
			events.push('womens_jingle');
		}
		if($scope.teen_girls_traditional === 'yes') {
			events.push('teen_girls_traditional');
		}
		if($scope.teen_girls_fancy === 'yes') {
			events.push('teen_girls_fancy');
		}
		if($scope.teen_girls_jingle === 'yes') {
			events.push('teen_girls_jingle');
		}
		if($scope.junior_girls_traditional === 'yes') {
			events.push('junior_girls_traditional');
		}
		if($scope.junior_girls_fancy === 'yes') {
			events.push('junior_girls_fancy');
		}
		if($scope.junior_girls_jingle === 'yes') {
			events.push('junior_girls_jingle');
		}
		if($scope.boys_tiny_tots === 'yes') {
			events.push('boys_tiny_tots');
		}
		if($scope.girls_tiny_tots === 'yes') {
			events.push('girls_tiny_tots');
		}
		if($scope.northern_drum === 'yes') {
			events.push('nothern_drum');
		}
		if($scope.southern_drum === 'yes') {
			events.push('southern_drum');
		}
		
		if(events.length > 0) {
			$scope.addContestant(events);
		}
		else {
			alert("Select a dance category");
		}*/
		
		$scope.addContestant(classes);
		
	};

	$scope.addContestant  = function(classes) {
				
		if( $scope.last_name == '' || $scope.last_name === undefined ||
			$scope.first_name == '' || $scope.first_name === undefined ||
			$scope.email == '' || $scope.first_name === undefined
			)
		{
				alert("Fill out all information");
				return;
		}
		
		contestants.create({
			last_name: $scope.last_name,
			first_name: $scope.first_name,
			email: $scope.email
		}, classes);

		alert("Successfully Added Person");
		location.reload();
	};
}])

.controller('ContestantsCtrl', [
'$location',
'$scope',
'contestant',
'contestants',
function($location, $scope, contestant, contestants){

	$scope.contestant = contestant;

	$scope.addComment = function() {
		if($scope.body === '') {
			return;
		}
		contestants.addComment(contestant._id, {
			body: $scope.body,
			author: 'user',
		}).success(function(comment){
			$scope.contestant.comments.push(comment);
		});
		$scope.body = '';
	};
	
	
	$scope.removeContestant = function() {
		var remove = window.confirm("Are you sure you want to DELETE this dancer?");
		if(!remove) {
			return;
		}
		var events = contestant.contestant.events;
		contestants.remove(contestant.contestant);
		
		for(var i = 0; i < events.length; i++) {
			contestants.removeEvent(events[i]);
		}
		
		$location.path('http://localhost:3000/#/home');
	};
	
	
	$scope.incrementUpvotes = function(comment) {
			contestants.upvoteComment(contestant, comment);
	};

}]);
