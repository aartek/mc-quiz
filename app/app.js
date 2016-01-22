'use strict';

var app = angular.module('myApp', ['ngRoute', 'ngTouch']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/quiz', {
        templateUrl: 'app/quizView/quiz.html',
        controller: 'QuizCtrl'
    }).otherwise({redirectTo: 'quiz'});
}]);


app.factory('shuffle', function () {
    return function shuffle(o) {
        if (o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        }
        return o;
    };
});

app.factory('Questions', function ($http, $q, shuffle) {
    return function () {
        this.questions = [];

        this.load = function () {
            var self = this;
            var deferred = $q.defer();
            $http.get('data.json').then(function (response) {
                self.questions = response.data.data;
                deferred.resolve(self.questions);
            });
            return deferred.promise;
        };

        this.shuffle = function () {
            shuffle(this.questions);
        };
    }
});