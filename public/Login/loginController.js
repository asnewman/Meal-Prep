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
         // console.log($scope.user);
         login.setCookieData(JSON.stringify($scope.user));
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
      // .then(function() {
      //    return $mdDialog.show($scope, "Logout successful", "Logout");
      // })
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
