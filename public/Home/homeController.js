app.controller('homeController', ['$scope', 'login', 'food',
 function($scope, login, food) {
   $scope.loadPage = function() {
      var user = login.getCookieData();
      if (user)
         $scope.user = JSON.parse(user);
      else {
         $scope.recipes = food.searchRecipes();
         // console.log($scope.recipes);
      }
   }
}]);
