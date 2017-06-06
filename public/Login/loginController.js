app.controller('loginController',
 ['$scope', '$state', 'login', '$filter', '$rootScope', '$mdDialog',
 function($scope, $state, login, $filter, $rootScope, $mdDialog) {

   $scope.loginDlg = function() {
      $mdDialog.show({
         templateUrl: 'Login/login.template.html'
      })
   }

   $scope.login = function() {
      login.login($scope.user)
      .then(function(user) {
         $rootScope.user = user;
         login.setCookieData(JSON.stringify(user));
         $state.go('home');
         window.location.reload();
      })
      .catch(function(err) {
         // if (err && err.data)
            // $mdDialog.show($scope, $filter('tagError')(err.data[0], $rootScope),
            //  "Error");
      });
   };

   $scope.logout = function() {
      login.logout()
      .then(function() {
         // Handling the dialog
         alert = $mdDialog.alert({
            title: "Logout",
            textContent: "Logout successful.",
            ok: 'Close'
         });

         return $mdDialog.show(alert)
         .finally(function() {
          alert = undefined;
        });
      })
      .then(function() {
         login.clearCookieData();
         $state.go('home');
         window.location.reload();
      })
      .catch(function() {
         $mdDialog.show($scope, "Failed to logout", "Error");
      })
   };
}]);
