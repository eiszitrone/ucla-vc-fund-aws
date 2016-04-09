var app = angular.module('uclaApp', ['ngRoute']);

app.controller('welcomeController', function ($scope, $http){
    $http.get('/')
    .success(function (data) {
    })
    .error(function () {

    });
});

app.controller('angellistController', function ($scope, $http){
    $scope.startDate = new Date("2010-01-01");
    $scope.endDate = new Date();
    // $scope.endDate = $scope.endDate.toISOString().substring(0, 10);
    $scope.category = "test";
    $scope.search = function() {
      $http.get('/angellist', {params: { startDate: $scope.startDate, endDate: $scope.endDate, category: $scope.category}})
      .success(function (data) {
          $scope.results = data;
      })
      .error(function () {

      });
    };
});

app.controller('s1Controller', function ($scope, $http){
  $scope.search = function() {
    $http.get('/s1', {params: { searchDate: $scope.searchDate }})
    .success(function (data) {
        $scope.results = data;
    })
    .error(function () {

    });
  };
  $scope.currentMonth = function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) month = "0" + month;
    $scope.searchDate = month + "/" + year;
    $scope.search();
  };

});


app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'welcome.html',
            controller: "welcomeController"
        })
        .when('/angellist', {
          templateUrl: 'angellist.html',
          controller: "angellistController"
        })
        .when('/s1', {
          templateUrl: 's1.html',
          controller: "s1Controller"
        })
});
