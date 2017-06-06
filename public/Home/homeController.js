app.controller('homeController', ['$scope', 'login',
 function($scope, login) {
   $scope.loadPage = function() {
      var user = login.getCookieData();
      if (user)
         $scope.user = JSON.parse(user);
   }
}]);
