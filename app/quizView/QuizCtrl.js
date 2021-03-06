'use strict';

app.controller('QuizCtrl', function ($scope, Questions, shuffle, $sce) {
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
            changeQuestion();
            $scope.maxScore = countAnswers($scope.questions);
        });
    }

    load();

    function countAnswers(questions){
        var cnt = 0;
        angular.forEach(questions, function(q){
            angular.forEach(q.answers,function(a){
                //Omit unknown answers from max score.
                if(a.check!=='2'){
                    cnt++;
                }
            });
        });
        return cnt;
    }

    $scope.prev = function () {
        if ($scope.questionIndex > 0) {
            $scope.clear();
            $scope.questionIndex--;
            changeQuestion();
        }
    };

    $scope.next = function () {
        if ($scope.questionIndex < $scope.questions.length - 1) {
            $scope.clear();
            $scope.questionIndex++;
            changeQuestion();
        }
    };

    $scope.clear = function () {
        $scope.validationOn = false;
        angular.forEach($scope.question.answers, function (item) {
            item.checked = false;
        });
    };

    function changeQuestion() {
        $scope.question = $scope.questions[$scope.questionIndex];
        $scope.question.question = trust($scope.question.question);
        shuffle($scope.question.answers);
        angular.forEach($scope.question.answers, function (item) {
            item.answer = trust(item.answer);
        });
    }

    function trust(item){
        if (typeof(item) !== 'object') {
            return $sce.trustAsHtml(item);
        }
        return item;
    }

    $scope.check = function () {
        angular.forEach($scope.question.answers, function (item) {
            if ((item.checked && item.check === '1') || (!item.checked && item.check === '0')) {
                item.ok = true;
                if (!$scope.question.validated) {
                    $scope.score++;
                }
            }
            else {
                item.ok = false;
            }
        });
        $scope.question.validated = true;
        $scope.validationOn = true;
    };

    $scope.restart = function () {
        $scope.score = 0;
        $scope.questionIndex = 0;
        $scope.validationOn = false;
        load();
    };
});