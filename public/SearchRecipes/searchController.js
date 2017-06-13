app.controller('searchController', ['$scope', 'login', '$http', '$state', 'ingr', '$mdDialog',
 function($scope, login, $http, $state, ingr, $mdDialog) {
    $scope.ingr = ingr;

    $scope.newRecipe = function() {
      

      $mdDialog.show({
         controller: DialogController,
         templateUrl: '/SearchRecipes/newRecipe.template.html',
         clickOutsideToClose: true,
         resolve: {
            rcps: ['$q', '$http', '$rootScope',
             function($q, $http, $rootScope) {
                return $http.get("/Proxy/search?key=6c623c76c61436feae669486ad7aabc1&sort=t")
                 .then(function(response){
                    $rootScope.allRecipes = response.data.recipes;
                    return response.data.recipes;
                 });
             }]
         }
      })

      // .then (function(answer) {
      //    if (answer) {
      //       return $http.post("/Prss/" + $rootScope.user._id + '/Ingr', answer);
      //    }
      // })
      //
      // .then(function() {
      //    return $http.get('/Prss/' + $rootScope.user._id + '/Ingr');
      // })
      //
      // .then(function(rsp) {
      //    $scope.ingr = rsp.data;
      // })

      .catch(function(err) {
         // Display any errors if there are any
         if (err && err.data) {
            alert = $mdDialog.alert({
               title: "Error",
               textContent: $filter('tagError')(err.data[0]),
               ok: 'Close'
            });

            return $mdDialog.show(alert)
            .finally(function() {
             alert = undefined;
           });
         }
      });
   };

   function DialogController($scope, $mdDialog, rcps) {
      $scope.rcps = rcps;
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
}]);
