app.controller('homeController', ['$scope', 'login',
 function($scope, login) {
   $scope.loadPage = function() {
      var cookie = login.getCookie();
      var user = login.getCookieData();

      if (cookie && user)
         $scope.user = JSON.parse(user);
         console.log($scope.user);
      }
   }
}]);
