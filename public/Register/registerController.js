app.controller('registerController',
 ['$scope', '$state', '$http', 'login', '$rootScope', '$mdDialog', '$filter',
 function($scope, $state, $http, login, $rootScope, $mdDialog, $filter) {
   $scope.root = $rootScope;
   $scope.user = {role: 0};

   $scope.registerUser = function() {
      $http.post("Prss", $scope.user)
      .then(function() {
         alert = $mdDialog.alert({
            title: "Registration",
            textContent: "Registration successful.",
            ok: 'Close'
         });

         return $mdDialog.show(alert)
         .finally(function() {
          alert = undefined;
        });

        return login.login($scope.user);
      })
      .then(function(user) {
         $scope.$parent.user = user;
         $state.go('home');
       })
      .catch(function(err) {
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

   $scope.quit = function() {
      $state.go('home');
   };
}]);
