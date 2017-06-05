app.controller('homeController', ['$scope', 'login',
 function($scope, login) {
   $scope.loadPage = function() {
      $scope.user = login.getCookieData();
      console.log(JSON.stringify($scope.user));
   }
}]);
