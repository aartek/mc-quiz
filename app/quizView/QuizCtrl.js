'use strict';

app.controller('QuizCtrl', function($scope, Questions, shuffle) {
        $scope.questionIndex = 0;
        $scope.question = {};
        $scope.score = 0;
        $scope.maxScore = 0;

        $scope.shuffle = shuffle;

        function load() {
            var q = new Questions();
            q.load().then(function () {
                q.shuffle();
                $scope.questions = q.questions;
                $scope.question = $scope.questions[$scope.questionIndex];
                $scope.maxScore = $scope.questions.length * 4;
            });
        }
        load();

        $scope.prev  = function(){
            if($scope.questionIndex > 0) {
				$scope.clear();
                $scope.questionIndex--;
                changeQuestion();
            }
        };

        $scope.next = function(){
            if($scope.questionIndex < $scope.questions.length - 1) {
				$scope.clear();
                $scope.questionIndex++;
                changeQuestion();
            }
        };

        $scope.clear = function(){
            $scope.validationOn = false;
            angular.forEach($scope.question.answers, function(item){
                item.checked = false;
            });
        };

        function changeQuestion(){
            $scope.question = $scope.questions[$scope.questionIndex];
            shuffle($scope.question.answers);
        }

        $scope.check = function(){
            angular.forEach($scope.question.answers, function(item){
                if((item.checked && item.check==='1') || (!item.checked && item.check === '0') ){
                    item.ok = true;
                    if(!$scope.question.validated){
                        $scope.score++;
                    }
                }
                else{
                    item.ok = false;
                }
            });
            $scope.question.validated = true;
            $scope.validationOn = true;
        };

        $scope.restart = function(){
            $scope.score = 0;
            $scope.questionIndex = 0;
            $scope.validationOn = false;
            load();
        };

        $scope.shuffle = function(){
            q.shuffle();
        };
});