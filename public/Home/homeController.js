app.controller('homeController', ['$scope', 'login', '$http', '$state', 'rcps',
 function($scope, login, $http, $state, rcps) {
    $scope.rcps = rcps;
}]);
