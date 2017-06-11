app.controller('fridgeController',
 ['$scope', '$state', '$http', '$mdDialog', 'ingr', '$rootScope',
function ($scope, $state, $http, $mdDialog, ingr, $rootScope) {

   $scope.ingr = ingr;
   console.log(JSON.stringify(ingr));

   $scope.newIngr = function() {

      $mdDialog.show({
         controller: DialogController,
         templateUrl: '/Fridge/newIngredient.template.html',
         clickOutsideToClose:true
      })

      .then (function(answer) {
         if (answer) {
            return $http.post("/Prss/" + $rootScope.user._id + '/Ingr', answer);
         }
      })

      .then(function() {
         return $http.get('/Prss/' + $rootScope.user._id + '/Ingr');
      })

      .then(function(rsp) {
         $scope.ingr = rsp.data;
      })

      .catch(function(err) {
         if (err && err.data) {
            console.log(err);
         }
      });
   };

   function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
         $mdDialog.hide();
      };
      $scope.cancel = function() {
          $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
         var data = {'name': $scope.name};
         $mdDialog.hide(data);
      };
   }
   $scope.delIngr = function(ingr) {
      $http.delete('/Prss/' + $rootScope.user._id + '/Ingr/' + ingr._id)
      .then(function(rsp) {
         $state.reload();
      })

      .catch(function(err) {
         if (err && err.data) {
         }
      });
   };

}]);
