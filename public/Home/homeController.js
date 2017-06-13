app.controller('homeController', ['$scope', 'login', '$http', '$state', 'rcps', 'meals', '$rootScope',
function($scope, login, $http, $state, rcps, meals, $rootScope) {
   $scope.rcps = rcps;
   $scope.meals = meals;
   $scope.allMeals = true;
   $scope.selectedDate = new Date();

   $scope.removemeal = function(meal) {
      $http.delete('/Prss/' + $rootScope.user._id + '/Mels/' + meal._id)
      .then(function(rsp) {
         console.log("here");
         $scope.meals.splice($scope.meals.indexOf(meal), 1);
      })

      .catch(function(err) {
         if (err && err.data) {
         }
      });
   };

   $scope.getSelectedMeals = function(selectedDate) {
      $scope.selectedDate = selectedDate;
      $scope.allMeals = false;
      console.log(selectedDate.getTime());
      $http.get("Prss/" + $rootScope.user._id + "/Mels?date=" + selectedDate.getTime())
      .then(function(response) {
         console.log(JSON.stringify(response.data));
         $scope.meals = response.data;
      });
   }

   $scope.getAllMeals = function() {
      $scope.allMeals = true;
      $http.get("Prss/" + $rootScope.user._id + "/Mels")
      .then(function(response) {
         $scope.meals = response.data;
      });
   }

}]);
