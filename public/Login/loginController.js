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
         login.setCookie($rootScope.cookie);

         $state.go('home');
         window.location.reload();
      })
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

   $scope.logout = function() {
      var cookie = login.getCookie();
      login.logout(cookie)
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
