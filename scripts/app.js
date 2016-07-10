var MeziApp = angular.module("MeziApp",[]);

MeziApp.config(["$logProvider", function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

MeziApp.controller('GameCtrl',["$log","$scope","$timeout","$interval", function($log, $scope, $timeout, $interval) {

	const TIMER_LEVEL_MED = 4000;
	const BOARD_SIZE = 16;
	const WAIT_BETWEEN_ROUND = 3000;

	var game = this;
	var count = 0;
	var gameTimeout = false;
	var interval;

	game.isHideStartBtn = false;
	game.timeLeft = 4;
	game.lives = 3;
	game.items = Array.apply(null, Array(BOARD_SIZE)).map(function (x, i) { return "available"; });

	game.start = function(){
		//Initialize the game
		game.isHideStartBtn = true;
		timerTicking();
		resetAll();
		colorCells();
		startTimer();
	};

	game.removeCell = function(idx){
		if(!game.items[idx]){
			game.items[idx] = "available";
			$log.debug("Final Array : >>", game.items);
		}
	};

	/* ============= All Private functions ================*/

	function colorCells(){
		if(count < 5){
			let tempCell = Math.floor((Math.random() * BOARD_SIZE));
			if(game.items[tempCell] === "available"){
				game.items[tempCell] = false;
				count++;
				colorCells();
			} else{
				colorCells();
			}
		}
	}

	function startTimer(){
		gameTimeout = $timeout(function(){
			playerWinOrLoose();
		}, TIMER_LEVEL_MED);
	}

	function timerTicking(){
		interval = $interval(function() {
			$log.debug("Before:" , game.timeLeft);
		    if(game.timeLeft > 0){
				game.timeLeft--;
				$log.debug("After:" , game.timeLeft);
			}
		}, 1000);
	}

	function playerWinOrLoose(){
		if(game.lives > 0){
			if(game.items.indexOf(false) > -1){
				game.status = "YOU LOST !!";
				$interval.cancel(interval);
				$timeout(function(){
					restartOnLoose();
					colorCells();
					timerTicking();
					startTimer();
				}, WAIT_BETWEEN_ROUND);
			} else{
				game.status = "YOU WON !!";
				$interval.cancel(interval);
				$timeout(function(){
					restartOnWin();
					colorCells();
					timerTicking();
					startTimer();
				}, WAIT_BETWEEN_ROUND);
			}
		} else{
			$interval.cancel(interval);
		}
	}

	function restartOnLoose(){
		game.lives--;
		count = 0;
		game.timeLeft = 4;
		$timeout.cancel(gameTimeout);
		game.items = Array.apply(null, Array(BOARD_SIZE)).map(function (x, i) { return "available"; });
	}

	function restartOnWin(){
		count = 0;
		game.timeLeft = 4;
		$timeout.cancel(gameTimeout);
		game.items = Array.apply(null, Array(BOARD_SIZE)).map(function (x, i) { return "available"; });
	}

	function resetAll(){
		game.status = '';
		$timeout.cancel(gameTimeout);
		count = 0;
		game.lives = 3;
		game.timeLeft = 4;
		game.items = Array.apply(null, Array(BOARD_SIZE)).map(function (x, i) { return "available"; });
	}

}]);
