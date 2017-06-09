app.controller('homeController', ['$scope', 'login', '$http',
 function($scope, login, $http) {
   $scope.loadPage = function() {
      var cookie = login.getCookie();
      var user = login.getCookieData();
      // var allRecipes = $http.get('/Proxy/search?key=6c623c76c61436feae669486ad7aabc1');

      // login.clearCookieData();
      // console.log(allRecipes);

      if (cookie && user)
         $scope.user = JSON.parse(user);
      }
   }]);
